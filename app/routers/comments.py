# НОВЫЙ ФАЙЛ: Эндпоинты комментариев (ЗАЩИЩЕННЫЕ для создания)
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.dependencies import get_current_active_user
from app.crud.comment import create_comment, get_comments_by_post, delete_comment
from app.schemas.comment import Comment, CommentCreate
from app.models.user import User as UserModel

router = APIRouter(prefix="/comments")

@router.get("/post/{post_id}", response_model=list[Comment])
async def read_post_comments(post_id: int, db: Session = Depends(get_db)):
    comments = await get_comments_by_post(db, post_id)
    result = []
    for c in comments:
        result.append({
            "id": c.id,
            "post_id": c.post_id,
            "author_id": c.author_id,
            "author": c.author.login,  # ключевое: логин автора
            "content": c.content,
            "created_at": c.created_at
        })
    return result

@router.post("/post/{post_id}", response_model=Comment)
async def create_post_comment(
    post_id: int,
    comment: CommentCreate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user)
):
    new_comment = await create_comment(db, comment, post_id, current_user.id)
    return {
        "id": new_comment.id,
        "post_id": new_comment.post_id,
        "author_id": new_comment.author_id,
        "author": current_user.login,  # логин автора
        "content": new_comment.content,
        "created_at": new_comment.created_at
    }

@router.delete("/{comment_id}")
async def delete_comment_endpoint(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user)  # ЗАЩИЩЕН
):
    success = await delete_comment(db, comment_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Comment not found or no permission")
    return {"message": "Comment deleted"}
