# ИЗМЕНЕНО: Переписан под SQLAlchemy с пагинацией и поиском
from app.models.user import User
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from app.models.post import Post
from app.schemas.post import PostCreate, PostUpdate
from app.crud.user import get_user_by_id

async def create_post(db: Session, post: PostCreate, author_id: int, current_user_id: int):
    # Проверка прав автора
    if author_id != current_user_id:
        raise Exception("No permission to create post for this author")
    
    db_post = Post(**post.dict(), author_id=author_id)
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

async def get_post_by_id(db: Session, post_id: int) -> Post:
    return db.query(Post).filter(Post.id == post_id).first()

async def get_posts(
    db: Session, 
    skip: int = 0, 
    limit: int = 100, 
    author_id: int = None,
    search: str = ""
):
    query = db.query(Post)
    
    if author_id:
        query = query.filter(Post.author_id == author_id)
    
    if search:
        query = query.filter(
            or_(
                Post.title.contains(search),
                Post.content.contains(search)
            )
        )
    
    return query.offset(skip).limit(limit).all()

async def update_post(db: Session, post_id: int, post_update: PostUpdate, current_user: User):
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        return None
    
    # Проверка прав доступа
    if post.author_id != current_user.id:
        raise Exception("No permission to update this post")
    
    update_data = post_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(post, field, value)
    
    db.commit()
    db.refresh(post)
    return post

async def delete_post(db: Session, post_id: int, user_id: int) -> bool:  # ← int, не объект!
    post = db.query(Post).filter(
        Post.id == post_id,
        Post.author_id == user_id  # ← используем user_id
    ).first()
    
    if not post or post.author_id != user_id:  # ← используем user_id
        return False
    
    
    db.delete(post)
    db.commit()
    return True