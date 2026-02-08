import datetime as dt
import uuid
from sqlalchemy import String, DateTime, Text
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base


def generate_id() -> str:
    return uuid.uuid4().hex


class User(Base):
    __tablename__ = "User"

    id: Mapped[str] = mapped_column(String(32), primary_key=True, default=generate_id)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    first_name: Mapped[str | None] = mapped_column("firstName", String(255), nullable=True)
    last_name: Mapped[str | None] = mapped_column("lastName", String(255), nullable=True)
    middle_name: Mapped[str | None] = mapped_column("middleName", String(255), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    photo_url: Mapped[str | None] = mapped_column("photoUrl", String(255), nullable=True)
    telegram_id: Mapped[str | None] = mapped_column("telegramId", String(255), unique=True, nullable=True)
    telegram_username: Mapped[str | None] = mapped_column("telegramUsername", String(255), nullable=True)
    telegram_photo_url: Mapped[str | None] = mapped_column("telegramPhotoUrl", String(255), nullable=True)
    telegram_auth_date: Mapped[dt.datetime | None] = mapped_column("telegramAuthDate", DateTime(timezone=True), nullable=True)
    birth_date: Mapped[dt.datetime | None] = mapped_column("birthDate", DateTime(timezone=True), nullable=True)
    password_hash: Mapped[str] = mapped_column("passwordHash", String(255), nullable=False)
    refresh_token_hash: Mapped[str | None] = mapped_column("refreshTokenHash", String(255), nullable=True)
    created_at: Mapped[dt.datetime] = mapped_column("createdAt", DateTime(timezone=True), default=dt.datetime.utcnow)
    updated_at: Mapped[dt.datetime] = mapped_column("updatedAt", DateTime(timezone=True), default=dt.datetime.utcnow, onupdate=dt.datetime.utcnow)
