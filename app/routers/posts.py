# НОВЫЙ ФАЙЛ: Эндпоинты постов (ЗАЩИЩЕННЫЕ для создания/изменения)
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from app.core.database import get_db
from app.dependencies import get_current_active_user
from app.crud.post import create_post, get_posts, get_post_by_id, update_post, delete_post
from app.schemas.post import Post, PostCreate, PostUpdate
from app.models.user import User as UserModel
from app.crud.like import get_post_likes_count, is_post_favorited

router = APIRouter(prefix="/posts")

@router.get("/", response_model=list[Post])
async def read_posts(
    skip: int = 0,
    limit: int = 100,
    author_id: Optional[int] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    posts = await get_posts(db, skip, limit, author_id, search)
    result = []
    for p in posts:
        result.append({
            "id": p.id,
            "author_id": p.author_id,
            "title": p.title,
            "content": p.content,
            "created_at": p.created_at,
            "updated_at": p.updated_at,
            "author": p.author.login 
        })
    return result

@router.get("/{post_id}", response_model=Post)
async def read_post(post_id: int, db: Session = Depends(get_db)):
    post = await get_post_by_id(db, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Добавляем количество лайков
    likes_count = await get_post_likes_count(db, post_id)
    post_dict = post.__dict__.copy()
    post_dict['likes_count'] = likes_count
    return post_dict

@router.post("/", response_model=Post, status_code=201)
async def create_new_post(
    post: PostCreate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user)
):
    new_post = await create_post(db, post, current_user.id, current_user.id)
    return {
        "id": new_post.id,
        "author_id": new_post.author_id,
        "title": new_post.title,
        "content": new_post.content,
        "created_at": new_post.created_at,
        "updated_at": new_post.updated_at,
        "author": current_user.login
    }

@router.put("/{post_id}", response_model=Post)
async def update_existing_post(
    post_id: int,
    post_update: PostUpdate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user)  # ЗАЩИЩЕН
):
    updated_post = await update_post(db, post_id, post_update, current_user)
    if not updated_post:
        raise HTTPException(status_code=404, detail="Post not found")
    return updated_post
