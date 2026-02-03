import pytest

def test_create_comment(client):
    # User + Post
    reg = client.post("/auth/register", json={
        "email": "comm@test.com", "login": "commuser", "password": "123456"
    })
    login = client.post("/auth/login", data={"username": "commuser", "password": "123456"})
    token = login.json()["access_token"]
    
    post = client.post("/posts/", json={
        "title": "Post for comment", "content": "content"
    }, headers={"Authorization": f"Bearer {token}"})
    post_id = post.json()["id"]
    
    response = client.post("/comments/", json={
        "post_id": post_id,
        "content": "Test comment!"
    }, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 201

def test_get_comments(client):
    response = client.get("/comments/?post_id=1")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
