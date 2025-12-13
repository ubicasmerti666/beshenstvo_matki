# НОВЫЙ ФАЙЛ: Pydantic схемы для Like/Favorite
from pydantic import BaseModel
from typing import Optional

class LikeCreate(BaseModel):
    post_id: Optional[int] = None
    comment_id: Optional[int] = None

class LikeBase(BaseModel):
    post_id: Optional[int]
    comment_id: Optional[int]
