"""
Environment configuration module.
This module centralizes all environment variable management and provides
default values and validation for application settings.
"""

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class EnvironmentError(Exception):
    """Custom exception for environment configuration errors."""
    pass

class Settings:
    """Centralized settings class for environment variables."""
    
    # JWT Settings
    SECRET_KEY: str = os.getenv("SECRET_KEY")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    REFRESH_TOKEN_EXPIRE_DAYS: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))
    
    # Database Settings
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./test.db")
    
    # API Settings
    API_VERSION: str = os.getenv("API_VERSION", "v1")
    DEBUG: bool = os.getenv("DEBUG", "False").lower() in ("true", "1", "yes")
    
    # Security Settings
    BCRYPT_ROUNDS: int = int(os.getenv("BCRYPT_ROUNDS", "12"))
    
    # Server Settings
    SERVER_HOST: str = os.getenv("SERVER_HOST", "0.0.0.0")
    SERVER_PORT: int = int(os.getenv("SERVER_PORT", "8000"))
    SERVER_RELOAD: bool = os.getenv("SERVER_RELOAD", "True").lower() in ("true", "1", "yes")
    SERVER_LOG_LEVEL: str = os.getenv("SERVER_LOG_LEVEL", "info")
    
    # URL Analyzer Settings
    REQUEST_TIMEOUT: int = int(os.getenv("REQUEST_TIMEOUT", "10"))
    MAX_CONTENT_SIZE: int = int(os.getenv("MAX_CONTENT_SIZE", "5242880"))  # 5MB default
    CHUNK_SIZE: int = int(os.getenv("CHUNK_SIZE", "8192"))  # 8KB default for streaming content
    USER_AGENT: str = os.getenv("USER_AGENT", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
    
    def __init__(self):
        """Initialize and validate environment variables."""
        self.validate_required_settings()
    
    def validate_required_settings(self) -> None:
        """Validate that all required environment variables are set."""
        if not self.SECRET_KEY:
            raise EnvironmentError(
                "SECRET_KEY environment variable is required but not set. "
                "Please set a secure secret key for JWT token generation."
            )
        
        if len(self.SECRET_KEY) < 32:
            raise EnvironmentError(
                "SECRET_KEY must be at least 32 characters long for security."
            )
        
        if self.ACCESS_TOKEN_EXPIRE_MINUTES <= 0:
            raise EnvironmentError(
                "ACCESS_TOKEN_EXPIRE_MINUTES must be a positive integer."
            )
        
        if self.REFRESH_TOKEN_EXPIRE_DAYS <= 0:
            raise EnvironmentError(
                "REFRESH_TOKEN_EXPIRE_DAYS must be a positive integer."
            )

# Create a global settings instance
settings = Settings()

# Export commonly used values for easy imports
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES
REFRESH_TOKEN_EXPIRE_DAYS = settings.REFRESH_TOKEN_EXPIRE_DAYS
DATABASE_URL = settings.DATABASE_URL
DEBUG = settings.DEBUG
BCRYPT_ROUNDS = settings.BCRYPT_ROUNDS
SERVER_HOST = settings.SERVER_HOST
SERVER_PORT = settings.SERVER_PORT
SERVER_RELOAD = settings.SERVER_RELOAD
SERVER_LOG_LEVEL = settings.SERVER_LOG_LEVEL
REQUEST_TIMEOUT = settings.REQUEST_TIMEOUT
MAX_CONTENT_SIZE = settings.MAX_CONTENT_SIZE
CHUNK_SIZE = settings.CHUNK_SIZE
USER_AGENT = settings.USER_AGENT

__all__ = [
    "settings",
    "SECRET_KEY", 
    "ALGORITHM", 
    "ACCESS_TOKEN_EXPIRE_MINUTES",
    "REFRESH_TOKEN_EXPIRE_DAYS",
    "DATABASE_URL",
    "DEBUG",
    "BCRYPT_ROUNDS",
    "SERVER_HOST",
    "SERVER_PORT", 
    "SERVER_RELOAD",
    "SERVER_LOG_LEVEL",
    "REQUEST_TIMEOUT",
    "MAX_CONTENT_SIZE",
    "CHUNK_SIZE", 
    "USER_AGENT",
    "EnvironmentError"
]
