import pytest

def test_create_post(client):
    # Регистрация + логин
    reg = client.post("/auth/register", json={
        "email": "post@test.com", "login": "postuser", "password": "123456"
    })
    login = client.post("/auth/login", data={"username": "post@test.com", "password": "123456"})
    token = login.json()["access_token"]
    
    response = client.post("/posts/", json={
        "title": "Test Post",
        "content": "Test content"
    }, headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 201
    assert response.json()["title"] == "Test Post"

def test_get_posts(client):
    response = client.get("/posts/?limit=5")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
