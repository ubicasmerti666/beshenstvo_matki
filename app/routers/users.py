# НОВЫЙ ФАЙЛ: Эндпоинты пользователей (ЗАЩИЩЕННЫЕ)
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
import datetime
from app.core.database import get_db
from app.dependencies import get_current_active_user
from app.crud.user import get_users, get_user_by_id, update_user, delete_user
from app.schemas.user import User
from app.models.user import User as UserModel

router = APIRouter()

@router.get("/", response_model=list[User])
async def read_users(
    skip: int = 0, 
    limit: int = 100, 
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user)  # ЗАЩИЩЕН
):
    return await get_users(db, skip=skip, limit=limit, search=search)

@router.get("/users/{user_id}", response_model=User)
async def read_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user)  # ЗАЩИЩЕН
):
    user = await get_user_by_id(db, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.patch("/users/{user_id}", response_model=User)
async def update_current_user(
    user_id: int,
    user_update: dict,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user)  # ЗАЩИЩЕН
):
    user = db.query(UserModel).filter(UserModel.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    
    # Проверяем права (только себя можно редактировать)
    if user.id != current_user.id:
        raise HTTPException(status_code=403, detail="Нет прав на редактирование")
    
    # ✅ ПРАВИЛЬНО - user_update уже dict
    update_data = user_update
        
    # Обновляем только переданные поля
    for field, value in update_data.items():
        if hasattr(user, field) and value is not None:
            setattr(user, field, value)
    
    user.updated_at = datetime.datetime.utcnow()
    db.commit()
    db.refresh(user)
    return user
