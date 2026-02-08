import os
import random
import time
import datetime as dt
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Request
from sqlalchemy.orm import Session
from ...db.session import get_session
from ...db.models import User
from ..schemas import UpdateProfileIn, AuthPayload
from ...core.security import read_access_user_id, to_user_out

router = APIRouter(prefix="/profile")


def get_user_or_401(request: Request, session: Session) -> User:
    user_id = read_access_user_id(request)
    if not user_id:
        raise HTTPException(status_code=401, detail="Unauthorized")
    user = session.query(User).filter(User.id == user_id).one_or_none()
    if not user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return user


@router.post("/", response_model=AuthPayload)
def update_profile(
    payload: UpdateProfileIn,
    request: Request,
    session: Session = Depends(get_session),
):
    user = get_user_or_401(request, session)

    if payload.firstName is not None:
        user.first_name = payload.firstName
    if payload.lastName is not None:
        user.last_name = payload.lastName
    if payload.middleName is not None:
        user.middle_name = payload.middleName
    if payload.description is not None:
        user.description = payload.description
    if payload.birthDate is not None:
        user.birth_date = None if payload.birthDate == "" else _parse_birth_date(payload.birthDate)

    session.commit()
    session.refresh(user)

    return {"user": to_user_out(user)}


def _parse_birth_date(value: str):
    try:
        return None if not value else dt.datetime.fromisoformat(value)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Invalid birth date.") from exc


@router.post("/photo", response_model=AuthPayload)
def upload_photo(
    request: Request,
    photo: UploadFile = File(...),
    session: Session = Depends(get_session),
):
    user = get_user_or_401(request, session)

    uploads_dir = os.path.join(os.getcwd(), "uploads")
    os.makedirs(uploads_dir, exist_ok=True)

    ext = os.path.splitext(photo.filename or "")[1]
    file_name = f"{int(time.time() * 1000)}-{random.randint(0, 1_000_000_000)}{ext}"
    file_path = os.path.join(uploads_dir, file_name)

    with open(file_path, "wb") as file_handle:
        file_handle.write(photo.file.read())

    user.photo_url = f"/uploads/{file_name}"
    session.commit()
    session.refresh(user)

    return {"user": to_user_out(user)}


@router.delete("/photo", response_model=AuthPayload)
def delete_photo(request: Request, session: Session = Depends(get_session)):
    user = get_user_or_401(request, session)
    user.photo_url = None
    session.commit()
    session.refresh(user)

    return {"user": to_user_out(user)}
