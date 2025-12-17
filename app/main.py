from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings  # ← ДОБАВЬ ЭТО!
from app.core.database import engine, Base
from app.models.user import User
from app.models.post import Post
from app.models.comment import Comment
from app.models.like import Like
from app.routers import auth, users, posts, comments, likes

app = FastAPI(title="Blog Platform API")

# СОЗДАЁТ ВСЕ ТАБЛИЦЫ!
Base.metadata.create_all(bind=engine)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Роутеры
app.include_router(auth.router, tags=["auth"])           # ← ДОБАВЬ!
app.include_router(users.router, tags=["users"])         # ← ДОБАВЬ!
app.include_router(posts.router, tags=["posts"])         # ← ДОБАВЬ!
app.include_router(comments.router, tags=["comments"])   # ← ДОБАВЬ!
app.include_router(likes.router, tags=["likes"])  

@app.get("/")
def read_root():
    return {"message": "Blog Platform API is running!"}
