import pytest

@pytest.mark.asyncio
async def test_register_and_login(async_client):
    # Register a new user
    resp = await async_client.post(
        "/auth/register",
        json={"email": "alice@example.com", "password": "Secret123!"},
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["email"] == "alice@example.com"
    assert "id" in data

    # Duplicate registration should fail
    dup = await async_client.post(
        "/auth/register",
        json={"email": "alice@example.com", "password": "Secret123!"},
    )
    assert dup.status_code == 400

    # Successful login
    login = await async_client.post(
        "/auth/login",
        json={"email": "alice@example.com", "password": "Secret123!"},
    )
    assert login.status_code == 200
    token = login.json()["access_token"]
    assert token

    # Wrong password
    bad = await async_client.post(
        "/auth/login",
        json={"email": "alice@example.com", "password": "WrongPass"},
    )
    assert bad.status_code == 401
