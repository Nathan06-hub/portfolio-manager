import os
import sys
import pathlib
import asyncio
import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

# Ensure the project root is on sys.path for imports when running tests directly
PROJECT_ROOT = pathlib.Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.append(str(PROJECT_ROOT))

from backend.main import app as fastapi_app
from backend.database import Base, get_db

# ----------------------------------------------------------------------
# Async SQLite in‑memory engine for isolated test runs
# ----------------------------------------------------------------------
SQLALCHEMY_TEST_URL = "sqlite+aiosqlite:///:memory:"

engine = create_async_engine(SQLALCHEMY_TEST_URL, echo=False, future=True)
AsyncSessionLocal = sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False, autoflush=False)

# Override the FastAPI dependency to use the test DB
async def override_get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session

fastapi_app.dependency_overrides[get_db] = override_get_db

# ----------------------------------------------------------------------
# Pytest fixtures
# ----------------------------------------------------------------------


@pytest.fixture(scope="function", autouse=True)
def init_db():
    """Create tables before any test runs and drop them afterwards.

    Runs the async engine setup synchronously using ``asyncio.run``.
    """
    import asyncio
    async def _create():
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    asyncio.run(_create())
    yield
    async def _drop():
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
    asyncio.run(_drop())

@pytest.fixture(scope="session")
def async_client() -> AsyncClient:
    """Create a shared AsyncClient for tests.

    The client is instantiated once per test session.
    """
    client = AsyncClient(app=fastapi_app, base_url="http://test")
    return client


# ----------------------------------------------------------------------
# Helper fixture: register + login → auth header
# ----------------------------------------------------------------------
@pytest.fixture
def auth_headers(async_client: AsyncClient) -> dict:
    """Create a test user, log in, and return authorization header.

    This fixture is synchronous because ``async_client`` is a session‑scoped sync
    fixture that yields an ``AsyncClient``. We use ``asyncio.run`` to execute the
    registration and login coroutines.
    """
    email = "test@example.com"
    password = "StrongPass123!"
    # Register the user
    asyncio.run(async_client.post("/auth/register", json={"email": email, "password": password}))
    # Login to obtain token
    login_resp = asyncio.run(async_client.post("/auth/login", json={"email": email, "password": password}))
    token = login_resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
