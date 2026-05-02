from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import HTTPException, status
from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings
from app.models.enums import UserRole

pwd_context = CryptContext(
    schemes=["bcrypt_sha256"],
    deprecated="auto",
)

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(
    subject: str,
    role: UserRole,
    expires_delta: Optional[timedelta] = None,
) -> str:
    if expires_delta is None:
        expires_delta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    expire = datetime.now(timezone.utc) + expires_delta
    to_encode = {
        "sub": subject,
        "exp": expire,
        "role": role.value,
    }

    secret_key = settings.secret_key
    if not secret_key:
        raise RuntimeError("SECRET_KEY is not configured")

    return jwt.encode(to_encode, secret_key, algorithm=ALGORITHM)


def decode_token(token: str) -> dict:
    try:
        secret_key = settings.secret_key
        if not secret_key:
            raise RuntimeError("SECRET_KEY is not configured")

        payload = jwt.decode(token, secret_key, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )