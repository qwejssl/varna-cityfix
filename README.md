# Varna CityFix

Varna CityFix is a full-stack civic issue reporting platform for Varna, Bulgaria. Citizens can submit city problems, track their reports, and administrators can review and manage them through a dedicated dashboard.

## Project structure

- `client/` — React + TypeScript + Vite frontend
- `server/` — FastAPI + SQLAlchemy + PostgreSQL backend

## Main features

- User registration and login
- Role-based access: citizen and admin
- Create, edit, and view reports
- Personal reports page
- Admin reports management
- City map with reported issues
- Image upload support
- Geocoding integration
- Health endpoint for backend checks

## Tech stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- Leaflet / React Leaflet

### Backend

- FastAPI
- SQLAlchemy
- PostgreSQL
- Alembic
- Pydantic Settings
- JWT authentication

## Local setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd varna-cityfix
```

### 2. Setup backend

```bash
cd server
python -m venv venv
source venv/bin/activate
python -m pip install -r requirements.txt
cp .env.example .env
python -m uvicorn app.main:app --reload
```

Backend runs on:

```txt
http://127.0.0.1:8000
```

API docs:

```txt
http://127.0.0.1:8000/docs
```

### 3. Setup frontend

Open a second terminal:

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

Frontend runs on:

```txt
http://127.0.0.1:5173
```

## Environment files

### Backend

Create `server/.env` from `server/.env.example`.

Required variables:

- `APP_NAME`
- `APP_ENV`
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `DATABASE_URL`
- `SECRET_KEY`

### Frontend

Create `client/.env` from `client/.env.example`.

Required variables:

- `VITE_API_URL`

## Smoke check

After both apps are running, verify:

1. Backend health works: `GET /health`
2. Frontend home page opens
3. Registration works
4. Login works
5. Reports list loads
6. New report creation works
7. Image upload works
8. My reports page works
9. Admin reports page works for admin users

## API quick links

- `/` — API root
- `/health` — health check
- `/docs` — Swagger UI

## Current status

The project is already a working MVP with authentication, protected routes, reporting flows, admin functionality, and map integration.
