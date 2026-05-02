from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.reports import router as reports_router
from app.api.v1.geocode import router as geocode_router
from app.api.v1.auth import router as auth_router


app = FastAPI(
    title="Varna CityFix API",
    description="Backend API for a city issue reporting platform for Varna, Bulgaria.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api/v1")
app.include_router(reports_router, prefix="/api/v1")
app.include_router(geocode_router, prefix="/api/v1")


@app.get("/")
def root():
    return {
        "message": "Welcome to Varna CityFix API",
        "city": "Varna",
        "country": "Bulgaria",
        "language": "English",
        "status": "running",
    }


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "varna-cityfix-backend",
    }