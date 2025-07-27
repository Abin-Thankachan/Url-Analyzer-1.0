import math
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List
from app.core.database import get_db
from app.models import User, UrlAnalysis
from app.schemas import UrlAnalysisCreate, UrlAnalysisResponse, PaginatedUrlAnalysisResponse
from app.services.auth.dependencies import get_current_user
from app.services.url_analyzer import UrlAnalyzerService

router = APIRouter()
url_analyzer = UrlAnalyzerService()

@router.post("/analyze", response_model=UrlAnalysisResponse, status_code=status.HTTP_201_CREATED)
async def analyze_url(
    url_data: UrlAnalysisCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        # Analyze the URL
        top_words = url_analyzer.analyze_url(str(url_data.url))
        
        # Save to database
        db_analysis = UrlAnalysis(
            url=str(url_data.url),
            top_words=top_words,
            user_id=current_user.id
        )
        db.add(db_analysis)
        db.commit()
        db.refresh(db_analysis)
        
        return db_analysis
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to analyze URL: {str(e)}"
        )

@router.get("/history", response_model=PaginatedUrlAnalysisResponse)
async def get_analysis_history(
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(10, ge=1, le=100, description="Page size"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Calculate offset
    offset = (page - 1) * size
    
    # Get total count
    total = db.query(UrlAnalysis).filter(UrlAnalysis.user_id == current_user.id).count()
    
    # Get paginated results
    analyses = db.query(UrlAnalysis)\
        .filter(UrlAnalysis.user_id == current_user.id)\
        .order_by(desc(UrlAnalysis.analyzed_at))\
        .offset(offset)\
        .limit(size)\
        .all()
    
    # Calculate total pages
    pages = math.ceil(total / size) if total > 0 else 1
    
    return PaginatedUrlAnalysisResponse(
        items=analyses,
        total=total,
        page=page,
        size=size,
        pages=pages
    )

@router.get("/history/all", response_model=PaginatedUrlAnalysisResponse)
async def get_all_analyses(
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(10, ge=1, le=100, description="Page size"),
    db: Session = Depends(get_db)
):
    """Get all URL analyses from all users (admin functionality)."""
    # Calculate offset
    offset = (page - 1) * size
    
    # Get total count
    total = db.query(UrlAnalysis).count()
    
    # Get paginated results with user information
    analyses = db.query(UrlAnalysis)\
        .order_by(desc(UrlAnalysis.analyzed_at))\
        .offset(offset)\
        .limit(size)\
        .all()
    
    # Calculate total pages
    pages = math.ceil(total / size) if total > 0 else 1
    
    return PaginatedUrlAnalysisResponse(
        items=analyses,
        total=total,
        page=page,
        size=size,
        pages=pages
    )
