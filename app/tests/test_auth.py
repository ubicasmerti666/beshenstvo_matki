import pytest

def test_register_success(client):
    response = client.post("/auth/register", json={
        "email": "test@test.com",
        "login": "testuser", 
        "password": "123456"
    })
    assert response.status_code == 201
    data = response.json()
    assert data["login"] == "testuser"

def test_login_success(client):
    client.post("/auth/register", json={
        "email": "login@test.com",
        "login": "loginuser", 
        "password": "123456"
    })
    response = client.post("/auth/login", data={
        "username": "login@test.com", 
        "password": "123456"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()
