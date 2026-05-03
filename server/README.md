# Varna CityFix Server

Backend API for Varna CityFix, built with FastAPI, SQLAlchemy, and PostgreSQL.

## Features

- JWT authentication
- User registration and login
- Role-based access
- Reports API
- Geocoding API
- Static uploads
- Health endpoint
- OpenAPI docs via Swagger UI

## Stack

- FastAPI
- SQLAlchemy
- PostgreSQL
- Alembic
- Pydantic Settings
- python-jose
- passlib

## Environment setup

Create a `.env` file in `server/` based on `.env.example`.

Example:

```env
APP_NAME="Varna CityFix API"
APP_ENV="development"

DB_HOST=localhost
DB_PORT=5432
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_NAME=varna_cityfix
DATABASE_URL=

SECRET_KEY=replace-with-a-random-secret-key
```

## Install and run

```bash
python -m venv venv
source venv/bin/activate
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

The API will run on:

```txt
http://127.0.0.1:8000
```

## Useful endpoints

- `GET /` — API root
- `GET /health` — health check
- `GET /docs` — Swagger UI
- `POST /api/v1/auth/register` — register
- `POST /api/v1/auth/login` — login

## Notes

- Uploaded files are served from `/uploads`
- CORS is configured for local frontend development
- App settings are loaded from `.env` using Pydantic Settings
