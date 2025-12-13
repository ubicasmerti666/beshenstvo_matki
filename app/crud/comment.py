# НОВЫЙ ФАЙЛ: CRUD для комментариев
from sqlalchemy.orm import Session
from app.models.comment import Comment
from app.schemas.comment import CommentCreate

async def create_comment(db: Session, comment: CommentCreate, post_id: int, author_id: int):
    db_comment = Comment(**comment.dict(), post_id=post_id, author_id=author_id)
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

async def get_comments_by_post(db: Session, post_id: int, skip: int = 0, limit: int = 100):
    return db.query(Comment).filter(Comment.post_id == post_id).offset(skip).limit(limit).all()

async def delete_comment(db: Session, comment_id: int, current_user_id: int):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment or comment.author_id != current_user_id:
        raise Exception("No permission to delete this comment")
    
    db.delete(comment)
    db.commit()
    return True
