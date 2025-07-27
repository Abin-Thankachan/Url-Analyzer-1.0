# Docker management script for URL Analyzer (PowerShell version)

param(
    [Parameter(Position=0)]
    [string]$Command = "help",
    [Parameter(Position=1)]
    [string]$Service = "app"
)

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Commands
switch ($Command.ToLower()) {
    "dev" {
        Write-Status "Starting development environment..."
        docker-compose up --build
    }
    "prod" {
        Write-Status "Starting production environment..."
        docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
    }
    "stop" {
        Write-Status "Stopping all services..."
        docker-compose down
    }
    "clean" {
        Write-Status "Stopping and removing all containers, networks, and volumes..."
        docker-compose down -v --remove-orphans
        docker system prune -f
    }
    "logs" {
        docker-compose logs -f $Service
    }
    "shell" {
        Write-Status "Opening shell in app container..."
        docker-compose exec app /bin/bash
    }
    "db" {
        Write-Status "Connecting to PostgreSQL..."
        docker-compose exec postgres psql -U postgres -d url_analyzer_db
    }
    "migrate" {
        Write-Status "Running database migrations..."
        docker-compose exec app alembic upgrade head
    }
    "build" {
        Write-Status "Building Docker images..."
        docker-compose build
    }
    default {
        Write-Host "URL Analyzer Docker Management Script" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Usage: .\docker.ps1 [COMMAND] [SERVICE]" -ForegroundColor White
        Write-Host ""
        Write-Host "Commands:" -ForegroundColor White
        Write-Host "  dev      Start development environment with hot reload" -ForegroundColor Gray
        Write-Host "  prod     Start production environment" -ForegroundColor Gray
        Write-Host "  stop     Stop all services" -ForegroundColor Gray
        Write-Host "  clean    Stop and remove all containers, networks, and volumes" -ForegroundColor Gray
        Write-Host "  logs     Show logs (optional: specify service name)" -ForegroundColor Gray
        Write-Host "  shell    Open shell in app container" -ForegroundColor Gray
        Write-Host "  db       Connect to PostgreSQL database" -ForegroundColor Gray
        Write-Host "  migrate  Run database migrations" -ForegroundColor Gray
        Write-Host "  build    Build Docker images" -ForegroundColor Gray
        Write-Host "  help     Show this help message" -ForegroundColor Gray
    }
}
