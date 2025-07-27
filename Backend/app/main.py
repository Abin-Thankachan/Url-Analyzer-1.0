from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import api_router

app = FastAPI(
    title="URL Content Analyzer API",
    description="API for analyzing URL content and finding top frequent words",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(api_router)

@app.get("/")
async def root():
    return {"message": "URL Content Analyzer API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
