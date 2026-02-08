import hashlib
import hmac
import time
import secrets
import datetime as dt
from fastapi import APIRouter, Request
from fastapi.responses import RedirectResponse, JSONResponse
from sqlalchemy.orm import Session
from ...core.config import settings
from ...db.session import get_session
from ...db.models import User
from ...core.security import issue_tokens, set_auth_cookies, read_access_user_id, hash_password
from fastapi import Depends

router = APIRouter(prefix="/auth")


@router.get("/telegram/callback")
def telegram_callback(request: Request, session: Session = Depends(get_session)):
    if not settings.telegram_bot_token:
        return JSONResponse(status_code=500, content={"error": "Telegram bot token is not configured."})

    redirect_param = request.query_params.get("redirect") or "/"
    redirect_path = redirect_param if redirect_param.startswith("/") else "/"

    payload = {key: value for key, value in request.query_params.items()}
    hash_value = payload.pop("hash", None)
    if not hash_value:
        return RedirectResponse(f"{settings.frontend_origin}{redirect_path}")

    data_check_string = "\n".join(
        f"{key}={payload[key]}"
        for key in sorted(payload.keys())
        if payload.get(key) is not None
    )

    secret_key = hashlib.sha256(settings.telegram_bot_token.encode("utf-8")).digest()
    calculated_hash = hmac.new(secret_key, data_check_string.encode("utf-8"), hashlib.sha256).hexdigest()

    if calculated_hash != hash_value:
        return RedirectResponse(f"{settings.frontend_origin}{redirect_path}")

    try:
        auth_date = int(payload.get("auth_date", "0"))
    except ValueError:
        auth_date = 0

    if not auth_date or int(time.time()) - auth_date > 86400:
        return RedirectResponse(f"{settings.frontend_origin}{redirect_path}")

    telegram_id = payload.get("id")
    if not telegram_id:
        return RedirectResponse(f"{settings.frontend_origin}{redirect_path}")

    current_user_id = read_access_user_id(request)
    existing_by_telegram = session.query(User).filter(User.telegram_id == telegram_id).one_or_none()

    if current_user_id:
        if existing_by_telegram and existing_by_telegram.id != current_user_id:
            return RedirectResponse(f"{settings.frontend_origin}{redirect_path}")

        user = session.query(User).filter(User.id == current_user_id).one_or_none()
        if not user:
            return RedirectResponse(f"{settings.frontend_origin}{redirect_path}")

        user.telegram_id = telegram_id
        user.telegram_username = payload.get("username")
        user.telegram_photo_url = payload.get("photo_url")
        user.telegram_auth_date = dt.datetime.fromtimestamp(auth_date, tz=dt.timezone.utc)
        if payload.get("first_name"):
            user.first_name = payload.get("first_name")
        if payload.get("last_name"):
            user.last_name = payload.get("last_name")

        session.commit()
        session.refresh(user)

        access_token, refresh_token = issue_tokens(user.id)
        response = RedirectResponse(f"{settings.frontend_origin}{redirect_path}")
        set_auth_cookies(response, access_token, refresh_token)
        return response

    if existing_by_telegram:
        access_token, refresh_token = issue_tokens(existing_by_telegram.id)
        response = RedirectResponse(f"{settings.frontend_origin}{redirect_path}")
        set_auth_cookies(response, access_token, refresh_token)
        return response

    email = f"tg_{telegram_id}@telegram.local"
    name = " ".join(filter(None, [payload.get("first_name"), payload.get("last_name")])) or None

    user = User(
        email=email,
        name=name,
        first_name=payload.get("first_name"),
        last_name=payload.get("last_name"),
        telegram_id=telegram_id,
        telegram_username=payload.get("username"),
        telegram_photo_url=payload.get("photo_url"),
        telegram_auth_date=dt.datetime.fromtimestamp(auth_date, tz=dt.timezone.utc),
        password_hash=hash_password(secrets.token_urlsafe(24)),
    )
    session.add(user)
    session.commit()
    session.refresh(user)

    access_token, refresh_token = issue_tokens(user.id)
    response = RedirectResponse(f"{settings.frontend_origin}{redirect_path}")
    set_auth_cookies(response, access_token, refresh_token)
    return response
