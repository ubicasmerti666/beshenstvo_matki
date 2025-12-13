# НОВЫЙ ФАЙЛ: Pydantic схемы для Comment API
from pydantic import BaseModel
from datetime import datetime

class CommentBase(BaseModel):
    content: str

class CommentCreate(CommentBase):
    pass

class Comment(CommentBase):
    id: int
    post_id: int
    author_id: int
    author: str  # будет строка (логин) в эндпоинте
    created_at: datetime

    class Config:
        from_attributes = True