# НОВЫЙ ФАЙЛ: CRUD для лайков и избранного
from sqlalchemy.orm import Session
from app.models.like import Like
from app.models.favorite import Favorite
from typing import Optional

async def create_like(db: Session, post_id: Optional[int], comment_id: Optional[int], user_id: int):
    # Проверка существования
    existing_like = db.query(Like).filter(
        Like.user_id == user_id,
        Like.post_id == post_id,
        Like.comment_id == comment_id
    ).first()
    
    if existing_like:
        db.delete(existing_like)
        db.commit()
        return False  # Удален лайк
    
    new_like = Like(user_id=user_id, post_id=post_id, comment_id=comment_id)
    db.add(new_like)
    db.commit()
    return True  # Добавлен лайк

async def create_favorite(db: Session, post_id: int, user_id: int):
    existing_fav = db.query(Favorite).filter(Favorite.user_id == user_id, Favorite.post_id == post_id).first()
    if existing_fav:
        db.delete(existing_fav)
        db.commit()
        return False
    
    new_fav = Favorite(user_id=user_id, post_id=post_id)
    db.add(new_fav)
    db.commit()
    return True

async def get_post_likes_count(db: Session, post_id: int) -> int:
    return db.query(Like).filter(Like.post_id == post_id).count()

async def is_post_favorited(db: Session, post_id: int, user_id: int) -> bool:
    return db.query(Favorite).filter(Favorite.post_id == post_id, Favorite.user_id == user_id).first() is not None
