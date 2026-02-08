from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from ...db.session import get_session
from ...db.models import User
from ..schemas import RegisterIn, LoginIn, AuthPayload
from ...core.security import hash_password, verify_password, issue_tokens, set_auth_cookies, to_user_out

router = APIRouter(prefix="/auth")


@router.post("/register", response_model=AuthPayload, status_code=201)
def register(payload: RegisterIn, response: Response, session: Session = Depends(get_session)):
    existing = session.query(User).filter(User.email == payload.email).one_or_none()
    if existing:
        raise HTTPException(status_code=409, detail="User already exists.")

    user = User(
        email=payload.email,
        name=payload.name,
        password_hash=hash_password(payload.password),
    )
    session.add(user)
    session.commit()
    session.refresh(user)

    access_token, refresh_token = issue_tokens(user.id)
    set_auth_cookies(response, access_token, refresh_token)

    return {"user": to_user_out(user)}


@router.post("/login", response_model=AuthPayload)
def login(payload: LoginIn, response: Response, session: Session = Depends(get_session)):
    user = session.query(User).filter(User.email == payload.email).one_or_none()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials.")

    access_token, refresh_token = issue_tokens(user.id)
    set_auth_cookies(response, access_token, refresh_token)

    return {"user": to_user_out(user)}
