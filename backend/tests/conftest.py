import os
import pytest
from fastapi.testclient import TestClient
import fakeredis

os.environ.setdefault("JWT_ACCESS_SECRET", "test_access")
os.environ.setdefault("JWT_REFRESH_SECRET", "test_refresh")
os.environ.setdefault("ACCESS_TOKEN_TTL", "15m")
os.environ.setdefault("REFRESH_TOKEN_TTL", "7d")
os.environ.setdefault("NODE_ENV", "test")
os.environ.setdefault("DATABASE_URL", "sqlite+pysqlite:///:memory:")
os.environ.setdefault("REDIS_URL", "redis://localhost:6379/0")

from app.main import create_app  # noqa: E402
from app.db.base import Base  # noqa: E402
from app.db.session import engine  # noqa: E402
import app.services.redis as redis_module  # noqa: E402
import app.core.security as auth_module  # noqa: E402


@pytest.fixture(autouse=True)
def _setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(autouse=True)
def _fake_redis(monkeypatch):
    fake_client = fakeredis.FakeRedis(decode_responses=True)
    monkeypatch.setattr(redis_module, "redis_client", fake_client)
    monkeypatch.setattr(auth_module, "redis_client", fake_client)
    yield


@pytest.fixture
def client():
    app = create_app()
    return TestClient(app)
