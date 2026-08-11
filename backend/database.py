"""Database configuration for FastAPI backend.

We use SQLAlchemy with async support (asyncpg) for PostgreSQL in production
and a SQLite file for local development. The connection URL is taken from the
environment variable ``DATABASE_URL``. If not set, we fall back to a SQLite
file ``sqlite:///./db/dev.db``.
"""

from .models import Base
import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

# Default to SQLite for local development
DEFAULT_SQLITE_URL = "sqlite+aiosqlite:///./db/dev.db"

# In production we expect a PostgreSQL URL, e.g.
# postgresql+asyncpg://user:password@db:5432/portfolio
DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_SQLITE_URL)

# Create async engine – ``future=True`` enables 2.0 style usage
engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    future=True,
)

# Session factory used by FastAPI dependencies
AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)

async def get_db() -> AsyncSession:
    """FastAPI dependency that yields a database session.

    Usage example:
    ```python
    @router.get("/items")
    async def read_items(db: AsyncSession = Depends(get_db)):
        result = await db.execute(...)
        return result.fetchall()
    ```
    """
    async with AsyncSessionLocal() as session:
        yield session
