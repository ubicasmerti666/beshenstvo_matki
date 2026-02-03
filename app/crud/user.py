# ИЗМЕНЕНО: Переписан под SQLAlchemy, добавлена JWT логика
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.core.security import get_password_hash, verify_password
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate

async def create_user(db: Session, user: UserCreate) -> User:
    hashed_password = get_password_hash(user.password)
    db_user = User(email=user.email, login=user.login, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

async def get_user_by_id(db: Session, user_id: int) -> User:
    return db.query(User).filter(User.id == user_id).first()

async def get_user_by_email(db: Session, email: str) -> User:
    return db.query(User).filter(User.email == email).first()

async def get_users(db: Session, skip: int = 0, limit: int = 100, search: str = ""):
    query = db.query(User)
    if search:
        query = query.filter(or_(User.login.contains(search), User.email.contains(search)))
    return query.offset(skip).limit(limit).all()

async def update_user(db: Session, user_id: int, user_update: UserUpdate, current_user: User):
    # Проверка прав доступа
    if current_user.id != user_id:
        raise Exception("No permission to update this user")
    
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        update_data = user_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(user, field, value)
        db.commit()
        db.refresh(user)
    return user

async def delete_user(db: Session, user_id: int, current_user: User):
    if current_user.id != user_id:
        raise Exception("No permission to delete this user")
    
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        db.delete(user)
        db.commit()
    return user
