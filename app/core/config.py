# НОВЫЙ ФАЙЛ: Загрузка настроек из .env файла
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # База данных
    DATABASE_URL: str = "postgresql://postgres:password@localhost/blog_db"
    
    # JWT настройки
    SECRET_KEY: str = "your-super-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS для фронтенда
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    class Config:
        env_file = ".env"

settings = Settings()
