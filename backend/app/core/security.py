import datetime as dt
import jwt
from fastapi import Request, Response
from passlib.context import CryptContext
from .config import settings
from ..services.redis import redis_client
from ..db.models import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return pwd_context.verify(password, password_hash)


def sign_access_token(user_id: str) -> str:
    expires_at = dt.datetime.utcnow() + dt.timedelta(seconds=settings.access_cookie_max_age)
    payload = {"sub": user_id, "exp": expires_at}
    return jwt.encode(payload, settings.jwt_access_secret, algorithm="HS256")


def sign_refresh_token(user_id: str) -> str:
    expires_at = dt.datetime.utcnow() + dt.timedelta(seconds=settings.refresh_cookie_max_age)
    payload = {"sub": user_id, "exp": expires_at}
    return jwt.encode(payload, settings.jwt_refresh_secret, algorithm="HS256")


def set_auth_cookies(response: Response, access_token: str, refresh_token: str) -> None:
    response.set_cookie(
        "access_token",
        access_token,
        httponly=True,
        samesite="lax",
        secure=settings.is_prod,
        max_age=settings.access_cookie_max_age,
        path="/",
    )
    response.set_cookie(
        "refresh_token",
        refresh_token,
        httponly=True,
        samesite="lax",
        secure=settings.is_prod,
        max_age=settings.refresh_cookie_max_age,
        path="/",
    )


def clear_auth_cookies(response: Response) -> None:
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")


def read_access_user_id(request: Request) -> str | None:
    token = request.cookies.get("access_token")
    if not token:
        return None
    try:
        payload = jwt.decode(token, settings.jwt_access_secret, algorithms=["HS256"])
    except jwt.PyJWTError:
        return None
    return payload.get("sub")


def to_user_out(user: User) -> dict:
    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "firstName": user.first_name,
        "lastName": user.last_name,
        "middleName": user.middle_name,
        "description": user.description,
        "photoUrl": user.photo_url,
        "birthDate": user.birth_date.isoformat() if user.birth_date else None,
        "createdAt": user.created_at.isoformat(),
    }


def refresh_key(user_id: str) -> str:
    return f"auth:refresh:{user_id}"


def issue_tokens(user_id: str) -> tuple[str, str]:
    access_token = sign_access_token(user_id)
    refresh_token = sign_refresh_token(user_id)
    refresh_hash = pwd_context.hash(refresh_token)
    redis_client.set(refresh_key(user_id), refresh_hash, ex=settings.refresh_cookie_max_age)
    return access_token, refresh_token


def verify_refresh_token(token: str) -> str:
    try:
        payload = jwt.decode(token, settings.jwt_refresh_secret, algorithms=["HS256"])
    except jwt.PyJWTError as exc:
        raise ValueError("Invalid refresh token.") from exc

    user_id = payload.get("sub")
    if not user_id:
        raise ValueError("Refresh token invalid.")

    refresh_hash = redis_client.get(refresh_key(user_id))
    if not refresh_hash:
        raise ValueError("Refresh token invalid.")

    if not pwd_context.verify(token, refresh_hash):
        raise ValueError("Refresh token invalid.")

    return user_id
