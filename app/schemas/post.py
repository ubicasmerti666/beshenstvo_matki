# НОВЫЙ ФАЙЛ: Pydantic схемы для Post API
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PostBase(BaseModel):
    title: str
    content: str

class PostCreate(PostBase):
    pass

class PostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None

class Post(BaseModel):
    id: int
    author_id: int
    title: str
    content: str
    created_at: datetime
    updated_at: Optional[datetime]
    author: str  

    class Config:
        from_attributes = True
