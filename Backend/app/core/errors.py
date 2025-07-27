"""
Centralized error handling module.
This module provides custom exceptions and error handlers for the application.
"""

from fastapi import HTTPException, status
from typing import Optional, Any, Dict

class AppError(Exception):
    """Base application error class."""
    
    def __init__(self, message: str, error_code: Optional[str] = None):
        self.message = message
        self.error_code = error_code
        super().__init__(self.message)

class AuthenticationError(AppError):
    """Authentication related errors."""
    pass

class AuthorizationError(AppError):
    """Authorization related errors."""
    pass

class ValidationError(AppError):
    """Data validation errors."""
    pass

class DatabaseError(AppError):
    """Database operation errors."""
    pass

class ExternalServiceError(AppError):
    """External service integration errors."""
    pass

# HTTP Exception factories for common errors
def credentials_exception(detail: str = "Could not validate credentials") -> HTTPException:
    """Create HTTP exception for invalid credentials."""
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=detail,
        headers={"WWW-Authenticate": "Bearer"},
    )

def forbidden_exception(detail: str = "Not enough permissions") -> HTTPException:
    """Create HTTP exception for forbidden access."""
    return HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail=detail,
    )

def not_found_exception(detail: str = "Resource not found") -> HTTPException:
    """Create HTTP exception for resource not found."""
    return HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=detail,
    )

def validation_exception(detail: str = "Validation error") -> HTTPException:
    """Create HTTP exception for validation errors."""
    return HTTPException(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        detail=detail,
    )

def internal_server_exception(detail: str = "Internal server error") -> HTTPException:
    """Create HTTP exception for internal server errors."""
    return HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail=detail,
    )

def bad_request_exception(detail: str = "Bad request") -> HTTPException:
    """Create HTTP exception for bad requests."""
    return HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=detail,
    )

# Common error responses
COMMON_RESPONSES: Dict[int, Dict[str, Any]] = {
    400: {"description": "Bad Request"},
    401: {"description": "Unauthorized"},
    403: {"description": "Forbidden"},
    404: {"description": "Not Found"},
    422: {"description": "Validation Error"},
    500: {"description": "Internal Server Error"},
}

__all__ = [
    "AppError",
    "AuthenticationError", 
    "AuthorizationError",
    "ValidationError",
    "DatabaseError",
    "ExternalServiceError",
    "credentials_exception",
    "forbidden_exception",
    "not_found_exception",
    "validation_exception",
    "internal_server_exception",
    "bad_request_exception",
    "COMMON_RESPONSES"
]
