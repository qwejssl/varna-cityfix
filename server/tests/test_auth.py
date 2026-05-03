def test_register_user(client):
    payload = {
        "full_name": "Andrei Ivanov",
        "email": "andrei@example.com",
        "password": "secret123",
    }

    response = client.post("/api/v1/auth/register", json=payload)

    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "andrei@example.com"
    assert data["full_name"] == "Andrei Ivanov"
    assert data["role"] == "CITIZEN"


def test_login_user(client):
    register_payload = {
        "full_name": "Andrei Ivanov",
        "email": "andrei@example.com",
        "password": "secret123",
    }

    client.post("/api/v1/auth/register", json=register_payload)

    response = client.post(
        "/api/v1/auth/login",
        data={
            "username": "andrei@example.com",
            "password": "secret123",
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )

    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["email"] == "andrei@example.com"
    assert data["role"] == "CITIZEN"