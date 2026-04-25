from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config import get_settings

settings = get_settings()

# Connect args for SQLite to allow multiple threads
connect_args = {"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(
    settings.DATABASE_URL,
    pool_size=10 if not settings.DATABASE_URL.startswith("sqlite") else None,
    max_overflow=20 if not settings.DATABASE_URL.startswith("sqlite") else None,
    pool_pre_ping=True,
    connect_args=connect_args
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """Dependency to get DB session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Create all tables."""
    Base.metadata.create_all(bind=engine)
