from pydantic_settings import BaseSettings
from functools import lru_cache
import os


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "sqlite:///./attendance.db"

    # JWT
    SECRET_KEY: str = "your-super-secret-key-change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440

    # Face Recognition
    FACE_DETECTION_MODEL: str = "retinaface"
    FACE_RECOGNITION_MODEL: str = "Facenet512"
    SIMILARITY_THRESHOLD: float = 0.68
    CONFIDENCE_THRESHOLD: float = 0.85

    # Storage
    UPLOAD_DIR: str = "./uploads"
    MAX_UPLOAD_SIZE: int = 10485760  # 10MB

    # CORS
    FRONTEND_URL: str = "http://localhost:3000"

    # App
    APP_ENV: str = "development"
    APP_PORT: int = 8000

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
