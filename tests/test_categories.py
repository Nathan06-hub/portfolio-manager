import pytest

@pytest.mark.asyncio
async def test_category_crud(async_client, auth_headers):
    # Create a category
    create_resp = await async_client.post(
        "/categories/",
        json={"name": "Épargne"},
        headers=auth_headers,
    )
    assert create_resp.status_code == 201
    cat = create_resp.json()
    assert cat["name"] == "Épargne"
    cat_id = cat["id"]

    # List categories and verify creation
    list_resp = await async_client.get("/categories/", headers=auth_headers)
    assert list_resp.status_code == 200
    categories = list_resp.json()
    assert any(c["id"] == cat_id for c in categories)

    # Delete the category
    del_resp = await async_client.delete(
        f"/categories/{cat_id}", headers=auth_headers
    )
    assert del_resp.status_code == 204

    # Verify it disappeared
    list2 = await async_client.get("/categories/", headers=auth_headers)
    assert all(c["id"] != cat_id for c in list2.json())

@pytest.mark.asyncio
async def test_category_isolation(async_client, auth_headers):
    # Register a second user (Bob)
    await async_client.post(
        "/auth/register",
        json={"email": "bob@example.com", "password": "Pass123!"},
    )
    login_resp = await async_client.post(
        "/auth/login",
        json={"email": "bob@example.com", "password": "Pass123!"},
    )
    bob_token = login_resp.json()["access_token"]
    bob_headers = {"Authorization": f"Bearer {bob_token}"}

    # Alice creates a category
    alice_cat = await async_client.post(
        "/categories/",
        json={"name": "Invest"},
        headers=auth_headers,
    )
    cat_id = alice_cat.json()["id"]

    # Bob attempts to delete Alice's category – should get 404
    resp = await async_client.delete(
        f"/categories/{cat_id}", headers=bob_headers
    )
    assert resp.status_code == 404

@pytest.mark.asyncio
async def test_missing_auth(async_client):
    # Any request without authentication must be rejected
    resp = await async_client.get("/categories/")
    assert resp.status_code == 401
