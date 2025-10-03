from fastapi import FastAPI
from pydantic import EmailStr

import crud

app = FastAPI()

@app.get("/users")
def getAllUsers():
    return crud.get_users()

@app.get("/users/{id}")
def getUserById(id: int):
    return crud.get_user_byid(id)

@app.post("/users")
def createUser(email: EmailStr, login: str, password: str):
    crud.create_user(email, login, password)
    return "свага тут"

@app.put('/users/{id}')
def updateUser(id: int, new_data: dict):
    if crud.update_user(id, new_data):
        return "свага на месте"
    else:
        return 'свага не на месте(('

@app.delete('/users/{id}')
def deleteUser(id: int):
    if crud.delete_user(id):
        return "эщкере присутствует"
    else:
        return 'эщкере не присутствует(('

@app.get("/posts")
def getAllPosts():
    return crud.get_all_posts()

@app.get("/posts/{authorId}")
def getPostById(authorId:int):
    return crud.get_posts_by_author_id(authorId)

@app.post("/posts")
def createPost(authorId: int, Title: str, Content: str):
    if crud.create_post(authorId, Title, Content):
        return "бомба"
    else:
        return "не бомба"

@app.put("/posts/{id}")
def updatePost(id: int, data: dict):
    crud.update_post(id, data)

@app.delete("/posts")