from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config
# Retrieve database URL from environment if not set in alembic.ini
import os
if not config.get_main_option("sqlalchemy.url"):
    config.set_main_option("sqlalchemy.url", os.getenv("DATABASE_URL", ""))

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    # Désactiver le parsing du fichier de logging car le fichier alembic.ini minimal ne définit pas de formatters
    try:
        fileConfig(config.config_file_name)
    except Exception:
        pass

# add your model's MetaData object here
# for 'autogenerate' support
import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from backend.models import Base
target_metadata = Base.metadata

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    # Définit l'URL de connexion ; utilise DATABASE_URL ou, à défaut, SQLite local
    db_url = config.get_main_option("sqlalchemy.url")
    if not db_url:
        db_url = os.getenv("DATABASE_URL", "sqlite:///./app.db")
        config.set_main_option("sqlalchemy.url", db_url)
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
