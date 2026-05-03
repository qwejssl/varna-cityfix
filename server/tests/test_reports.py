def create_user_and_login(client):
    register_payload = {
        "full_name": "Andrei Ivanov",
        "email": "andrei@example.com",
        "password": "secret123",
    }

    client.post("/api/v1/auth/register", json=register_payload)

    login_response = client.post(
        "/api/v1/auth/login",
        data={
            "username": "andrei@example.com",
            "password": "secret123",
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )

    token = login_response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_create_report(client):
    headers = create_user_and_login(client)

    payload = {
        "title": "Broken pavement",
        "description": "Large damaged pavement near the bus stop",
        "category": "PAVEMENT",
        "district": "PRIMORSKI",
        "address": "Sea Garden, Varna",
        "latitude": 43.2141,
        "longitude": 27.9147,
        "image_url": None,
    }

    response = client.post("/api/v1/reports/", json=payload, headers=headers)

    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Broken pavement"
    assert data["status"] == "NEW"
    assert data["created_by_id"] == 1


def test_get_my_reports(client):
    headers = create_user_and_login(client)

    payload = {
        "title": "Broken pavement",
        "description": "Large damaged pavement near the bus stop",
        "category": "PAVEMENT",
        "district": "PRIMORSKI",
        "address": "Sea Garden, Varna",
        "latitude": 43.2141,
        "longitude": 27.9147,
        "image_url": None,
    }

    client.post("/api/v1/reports/", json=payload, headers=headers)
    response = client.get("/api/v1/reports/my", headers=headers)

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["title"] == "Broken pavement"