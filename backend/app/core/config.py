from pydantic_settings import BaseSettings
from pydantic import Field


def parse_duration_seconds(value: str, fallback_seconds: int) -> int:
    value = value.strip()
    if not value:
        return fallback_seconds
    amount = ""
    unit = ""
    for char in value:
        if char.isdigit():
            amount += char
        else:
            unit += char
    if not amount or len(unit) != 1:
        return fallback_seconds
    try:
        qty = int(amount)
    except ValueError:
        return fallback_seconds
    if unit == "s":
        return qty
    if unit == "m":
        return qty * 60
    if unit == "h":
        return qty * 60 * 60
    if unit == "d":
        return qty * 60 * 60 * 24
    return fallback_seconds


class Settings(BaseSettings):
    port: int = Field(default=4000, alias="PORT")
    frontend_origin: str = Field(default="http://localhost:5173", alias="FRONTEND_ORIGIN")
    jwt_access_secret: str = Field(default="", alias="JWT_ACCESS_SECRET")
    jwt_refresh_secret: str = Field(default="", alias="JWT_REFRESH_SECRET")
    access_token_ttl: str = Field(default="15m", alias="ACCESS_TOKEN_TTL")
    refresh_token_ttl: str = Field(default="7d", alias="REFRESH_TOKEN_TTL")
    node_env: str = Field(default="development", alias="NODE_ENV")
    telegram_bot_token: str = Field(default="", alias="TELEGRAM_BOT_TOKEN")
    redis_url: str = Field(default="redis://localhost:6379", alias="REDIS_URL")
    database_url: str = Field(default="postgresql+psycopg://postgres:postgres@localhost:5432/app", alias="DATABASE_URL")

    @property
    def is_prod(self) -> bool:
        return self.node_env == "production"

    @property
    def access_cookie_max_age(self) -> int:
        return parse_duration_seconds(self.access_token_ttl, 15 * 60)

    @property
    def refresh_cookie_max_age(self) -> int:
        return parse_duration_seconds(self.refresh_token_ttl, 7 * 24 * 60 * 60)


settings = Settings()

if not settings.jwt_access_secret or not settings.jwt_refresh_secret:
    raise RuntimeError("JWT secrets are not set. Define JWT_ACCESS_SECRET and JWT_REFRESH_SECRET.")
