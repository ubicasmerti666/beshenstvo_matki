# НОВЫЙ ФАЙЛ: Эндпоинты лайков/избранного (ЗАЩИЩЕННЫЕ)
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.dependencies import get_current_active_user
from app.crud.like import create_like, create_favorite, is_post_favorited
from app.models.user import User as UserModel
from typing import Optional

router = APIRouter()

@router.post("/posts/{post_id}/like")
async def like_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user)  # ЗАЩИЩЕН
):
    result = await create_like(db, post_id=post_id, comment_id=None, user_id=current_user.id)
    return {"liked": result}

@router.post("/post/{post_id}/favorite")
async def toggle_favorite(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user)  # ЗАЩИЩЕН
):
    result = await create_favorite(db, post_id, current_user.id)
    is_favorited = await is_post_favorited(db, post_id, current_user.id)
    return {"favorited": is_favorited}
