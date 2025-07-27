"""
Core module for centralized configurations and utilities.
"""

from .environment import (
    settings, SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES, 
    REFRESH_TOKEN_EXPIRE_DAYS, DATABASE_URL, DEBUG, SERVER_HOST, SERVER_PORT, SERVER_RELOAD, 
    SERVER_LOG_LEVEL, REQUEST_TIMEOUT, MAX_CONTENT_SIZE, USER_AGENT
)
from .errors import (
    AppError, AuthenticationError, AuthorizationError, ValidationError,
    credentials_exception, forbidden_exception, not_found_exception,
    validation_exception, internal_server_exception, bad_request_exception
)

__all__ = [
    # Environment
    "settings", "SECRET_KEY", "ALGORITHM", "ACCESS_TOKEN_EXPIRE_MINUTES", 
    "REFRESH_TOKEN_EXPIRE_DAYS", "DATABASE_URL", "DEBUG", "SERVER_HOST", "SERVER_PORT", "SERVER_RELOAD",
    "SERVER_LOG_LEVEL", "REQUEST_TIMEOUT", "MAX_CONTENT_SIZE", "USER_AGENT",
    
    # Errors
    "AppError", "AuthenticationError", "AuthorizationError", "ValidationError",
    "credentials_exception", "forbidden_exception", "not_found_exception",
    "validation_exception", "internal_server_exception", "bad_request_exception"
]
