"""
Main API router module.
This module provides centralized router management for the entire API.
"""

from fastapi import APIRouter
from app.routers.v1.auth import router as auth_router
from app.routers.v1.urls import router as urls_router

# Create the main API router
api_router = APIRouter(prefix="/api")

# Create v1 router
v1_router = APIRouter()
v1_router.include_router(auth_router, prefix="/auth", tags=["Authentication"])
v1_router.include_router(urls_router, prefix="/urls", tags=["URL Analysis"])

# Include v1 router with v1 prefix
api_router.include_router(v1_router, prefix="/v1")

# Export the main router
__all__ = ["api_router"]
