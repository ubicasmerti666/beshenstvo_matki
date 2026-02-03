# НОВЫЙ ФАЙЛ: Зависимости для роутеров
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.crud.user import get_user_by_id

async def get_current_active_user(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not current_user:
        raise HTTPException(status_code=400, detail="User not found")
    return current_user
