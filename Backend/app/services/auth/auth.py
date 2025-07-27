from datetime import datetime, timedelta
from typing import Optional, Tuple
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
import secrets
from app.models import User, RefreshToken
from app.schemas import TokenData
from app.core.environment import SECRET_KEY, ALGORITHM, BCRYPT_ROUNDS, REFRESH_TOKEN_EXPIRE_DAYS

pwd_context = CryptContext(
    schemes=["bcrypt"], 
    deprecated="auto",
    bcrypt__rounds=BCRYPT_ROUNDS
)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now() + expires_delta
    else:
        expire = datetime.now() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_refresh_token() -> str:
    """Create a secure refresh token."""
    return secrets.token_urlsafe(32)

def store_refresh_token(db: Session, user_id: int, refresh_token: str) -> RefreshToken:
    """Store refresh token in database."""
    expires_at = datetime.now() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    
    # Revoke existing refresh tokens for the user (optional security measure)
    db.query(RefreshToken).filter(
        RefreshToken.user_id == user_id,
        RefreshToken.is_revoked == False
    ).update({"is_revoked": True})
    
    # Create new refresh token
    db_refresh_token = RefreshToken(
        token=refresh_token,
        user_id=user_id,
        expires_at=expires_at
    )
    db.add(db_refresh_token)
    db.commit()
    db.refresh(db_refresh_token)
    return db_refresh_token

def verify_refresh_token(db: Session, refresh_token: str) -> Optional[User]:
    """Verify refresh token and return associated user."""
    db_token = db.query(RefreshToken).filter(
        RefreshToken.token == refresh_token,
        RefreshToken.is_revoked == False,
        RefreshToken.expires_at > datetime.now()
    ).first()
    
    if not db_token:
        return None
    
    return db_token.user

def revoke_refresh_token(db: Session, refresh_token: str) -> bool:
    """Revoke a refresh token."""
    db_token = db.query(RefreshToken).filter(
        RefreshToken.token == refresh_token
    ).first()
    
    if db_token:
        db_token.is_revoked = True
        db.commit()
        return True
    return False

def create_token_pair(db: Session, user: User) -> Tuple[str, str]:
    """Create both access and refresh tokens for a user."""
    # Create access token
    access_token_expires = timedelta(minutes=15)  # Short-lived
    access_token = create_access_token(
        data={"sub": user.username}, 
        expires_delta=access_token_expires
    )
    
    # Create and store refresh token
    refresh_token = create_refresh_token()
    store_refresh_token(db, user.id, refresh_token)
    
    return access_token, refresh_token

def verify_token(token: str, credentials_exception=None):
    if credentials_exception is None:
        from app.core.errors import credentials_exception as default_creds_exception
        credentials_exception = default_creds_exception()
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    return token_data

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def authenticate_user(db: Session, username: str, password: str):
    user = get_user_by_username(db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user
