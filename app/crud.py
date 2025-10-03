from pydantic import EmailStr
from datetime import datetime
from models.user import User
from models.post import Post


users = []
posts = []
nextid = 1
nextPostId = 1

def create_user(Email: EmailStr, Login: str, Password: str):
    global nextid
    user = User(id = nextid, email = Email, login = Login, password = Password, createdAt=datetime.now(), updatedAt=datetime.now())
    users.append(user)
    nextid += 1
    return True

def get_users():
    return users

def get_user_byid(user_id: int):
    for user in users:
        if user.id == user_id:
            return user
    return None

def delete_user(user_id :int):
    for user in users:
        if user.id == user_id:
            users.remove(user)
            return True
    return False

def update_user(user_id: int, new_data: dict):
    for i, user in enumerate(users):
        if user.id == user_id:
            updated_user = user.copy(update=new_data)
            updated_user.updatedAt = datetime.now()
            users[i] = updated_user
            return True
    return False

def create_post(author_id: int, Title: str, Content: str):
    global nextPostId
    for user in users:
        if author_id == user.id:
            post = Post(authorId = author_id, title=Title, content=Content, createdAt=datetime.now(), updatedAt=datetime.now())
            posts.append(post)
            nextPostId += 1
            return True

def get_all_posts():
    return posts

def get_posts_by_author_id(id: int):
    returnposts = []
    for post in posts:
        if post.authorId == id:
            returnposts.append(post)
    return returnposts

def update_post(id: int, update_data: dict):
    for i, post in enumerate(posts):
       if post.id == id:
           updated_post = post.copy(update=update_data)
           updated_post.updatedAt = datetime.now()
           posts[i] = updated_post
           return True
    return False

def delete_post(id: int):
    for post in posts:
        if post.id == id:
            posts.remove(post)
            return True
    return False