from pydantic import BaseModel, EmailStr, HttpUrl
from datetime import datetime
from typing import List, Optional

# User schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    username: str
    password: str

# Token schemas
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class LoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
    user: UserResponse

# URL Analysis schemas
class UrlAnalysisCreate(BaseModel):
    url: HttpUrl

class WordCount(BaseModel):
    word: str
    count: int

class UrlAnalysisResponse(BaseModel):
    id: int
    url: str
    top_words: List[WordCount]
    analyzed_at: datetime
    user: UserResponse
    
    class Config:
        from_attributes = True

class PaginatedUrlAnalysisResponse(BaseModel):
    items: List[UrlAnalysisResponse]
    total: int
    page: int
    size: int
    pages: int
