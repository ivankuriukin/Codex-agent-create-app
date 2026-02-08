import base64
import os
import random
import time
import datetime as dt
import strawberry
from fastapi import Request, Response
from sqlalchemy.orm import Session
from ..core.security import (
    issue_tokens,
    set_auth_cookies,
    clear_auth_cookies,
    verify_refresh_token,
    read_access_user_id,
    to_user_out,
)
from ..db.models import User


@strawberry.type
class UserType:
    id: strawberry.ID
    email: str
    name: str | None
    firstName: str | None
    lastName: str | None
    middleName: str | None
    description: str | None
    photoUrl: str | None
    birthDate: str | None
    createdAt: str


@strawberry.type
class AuthPayload:
    user: UserType


@strawberry.input
class UpdateProfileInput:
    firstName: str | None = None
    lastName: str | None = None
    middleName: str | None = None
    description: str | None = None
    birthDate: str | None = None


@strawberry.input
class UploadProfilePhotoInput:
    fileName: str
    base64: str


def _user_type(user: User) -> UserType:
    payload = to_user_out(user)
    return UserType(**payload)


def _get_current_user(context: dict) -> User | None:
    user_id = read_access_user_id(context["request"])
    if not user_id:
        return None
    return context["session"].query(User).filter(User.id == user_id).one_or_none()


@strawberry.type
class Query:
    @strawberry.field
    def me(self, info) -> UserType | None:
        user = _get_current_user(info.context)
        return _user_type(user) if user else None


@strawberry.type
class Mutation:
    @strawberry.mutation
    def register(self, info, email: str, password: str, name: str | None = None) -> AuthPayload:
        session = info.context["session"]
        existing = session.query(User).filter(User.email == email).one_or_none()
        if existing:
            raise ValueError("User already exists.")

        from ..core.security import hash_password

        user = User(email=email, name=name, password_hash=hash_password(password))
        session.add(user)
        session.commit()
        session.refresh(user)

        access_token, refresh_token = issue_tokens(user.id)
        set_auth_cookies(info.context["response"], access_token, refresh_token)

        return AuthPayload(user=_user_type(user))

    @strawberry.mutation
    def login(self, info, email: str, password: str) -> AuthPayload:
        from ..core.security import verify_password

        session = info.context["session"]
        user = session.query(User).filter(User.email == email).one_or_none()
        if not user or not verify_password(password, user.password_hash):
            raise ValueError("Invalid credentials.")

        access_token, refresh_token = issue_tokens(user.id)
        set_auth_cookies(info.context["response"], access_token, refresh_token)

        return AuthPayload(user=_user_type(user))

    @strawberry.mutation
    def refresh(self, info) -> AuthPayload:
        token = info.context["request"].cookies.get("refresh_token")
        if not token:
            raise ValueError("Refresh token missing.")

        user_id = verify_refresh_token(token)
        session = info.context["session"]
        user = session.query(User).filter(User.id == user_id).one_or_none()
        if not user:
            raise ValueError("Refresh token invalid.")

        access_token, refresh_token = issue_tokens(user.id)
        set_auth_cookies(info.context["response"], access_token, refresh_token)

        return AuthPayload(user=_user_type(user))

    @strawberry.mutation
    def logout(self, info) -> bool:
        user_id = read_access_user_id(info.context["request"])
        if user_id:
            from ..services.redis import redis_client
            from ..core.security import refresh_key

            redis_client.delete(refresh_key(user_id))

        clear_auth_cookies(info.context["response"])
        return True

    @strawberry.mutation
    def updateProfile(self, info, input: UpdateProfileInput) -> AuthPayload:
        session = info.context["session"]
        user = _get_current_user(info.context)
        if not user:
            raise ValueError("Unauthorized")

        if input.firstName is not None:
            user.first_name = input.firstName
        if input.lastName is not None:
            user.last_name = input.lastName
        if input.middleName is not None:
            user.middle_name = input.middleName
        if input.description is not None:
            user.description = input.description
        if input.birthDate is not None:
            user.birth_date = None if input.birthDate == "" else dt.datetime.fromisoformat(input.birthDate)

        session.commit()
        session.refresh(user)

        return AuthPayload(user=_user_type(user))

    @strawberry.mutation
    def uploadProfilePhoto(self, info, input: UploadProfilePhotoInput) -> AuthPayload:
        session = info.context["session"]
        user = _get_current_user(info.context)
        if not user:
            raise ValueError("Unauthorized")

        uploads_dir = os.path.join(os.getcwd(), "uploads")
        os.makedirs(uploads_dir, exist_ok=True)

        ext = os.path.splitext(input.fileName)[1]
        file_name = f"{int(time.time() * 1000)}-{random.randint(0, 1_000_000_000)}{ext}"
        file_path = os.path.join(uploads_dir, file_name)

        data = input.base64
        if "," in data:
            data = data.split(",", 1)[1]

        with open(file_path, "wb") as file_handle:
            file_handle.write(base64.b64decode(data))

        user.photo_url = f"/uploads/{file_name}"
        session.commit()
        session.refresh(user)

        return AuthPayload(user=_user_type(user))

    @strawberry.mutation
    def deleteProfilePhoto(self, info) -> AuthPayload:
        session = info.context["session"]
        user = _get_current_user(info.context)
        if not user:
            raise ValueError("Unauthorized")

        user.photo_url = None
        session.commit()
        session.refresh(user)

        return AuthPayload(user=_user_type(user))


schema = strawberry.Schema(query=Query, mutation=Mutation)


def get_context(request: Request, response: Response):
    session = request.state.db
    return {"request": request, "response": response, "session": session}
