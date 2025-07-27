# Production Build Script for URL Analyzer Frontend (PowerShell)
# This script builds and deploys the frontend application for production

param(
    [switch]$StartContainers
)

Write-Host "Starting Production Build for URL Analyzer Frontend" -ForegroundColor Green

# Check if .env.production exists
if (-not (Test-Path ".env.production")) {
    Write-Host "Warning: .env.production not found. Using .env.production.sample as template." -ForegroundColor Yellow
    if (Test-Path ".env.production.sample") {
        Copy-Item ".env.production.sample" ".env.production"
        Write-Host "Please edit .env.production with your production values before running this script again." -ForegroundColor Yellow
        exit 1
    }
}

# Load production environment variables
if (Test-Path ".env.production") {
    Write-Host "Loading production environment variables..." -ForegroundColor Blue
    Get-Content ".env.production" | Where-Object { $_ -notmatch '^#' -and $_ -ne '' } | ForEach-Object {
        $key, $value = $_ -split '=', 2
        [Environment]::SetEnvironmentVariable($key, $value, 'Process')
    }
}

# Set default values if not provided
$env:VITE_API_BASE_URL = if ($env:VITE_API_BASE_URL) { $env:VITE_API_BASE_URL } else { "http://localhost:8000/api/v1" }
$env:VITE_API_TIMEOUT = if ($env:VITE_API_TIMEOUT) { $env:VITE_API_TIMEOUT } else { "30000" }
$env:VITE_APP_NAME = if ($env:VITE_APP_NAME) { $env:VITE_APP_NAME } else { "URL Analyzer" }
$env:VITE_APP_VERSION = if ($env:VITE_APP_VERSION) { $env:VITE_APP_VERSION } else { "1.0.0" }
$env:VITE_AUTH_STORAGE_KEY = if ($env:VITE_AUTH_STORAGE_KEY) { $env:VITE_AUTH_STORAGE_KEY } else { "webAnalyzer_auth" }
$env:VITE_DEBUG_MODE = if ($env:VITE_DEBUG_MODE) { $env:VITE_DEBUG_MODE } else { "false" }
$env:VITE_ENABLE_ANALYTICS = if ($env:VITE_ENABLE_ANALYTICS) { $env:VITE_ENABLE_ANALYTICS } else { "true" }

# Build Docker image
Write-Host "Building Docker image..." -ForegroundColor Blue

$dockerArgs = @(
    "build"
    "--build-arg", "VITE_API_BASE_URL=$($env:VITE_API_BASE_URL)"
    "--build-arg", "VITE_API_TIMEOUT=$($env:VITE_API_TIMEOUT)"
    "--build-arg", "VITE_APP_NAME=$($env:VITE_APP_NAME)"
    "--build-arg", "VITE_APP_VERSION=$($env:VITE_APP_VERSION)"
    "--build-arg", "VITE_AUTH_STORAGE_KEY=$($env:VITE_AUTH_STORAGE_KEY)"
    "--build-arg", "VITE_DEBUG_MODE=$($env:VITE_DEBUG_MODE)"
    "--build-arg", "VITE_ENABLE_ANALYTICS=$($env:VITE_ENABLE_ANALYTICS)"
    "-t", "url-analyzer-frontend:latest"
    "-t", "url-analyzer-frontend:$($env:VITE_APP_VERSION)"
    "."
)

& docker @dockerArgs

if ($LASTEXITCODE -eq 0) {
    Write-Host "Docker image built successfully!" -ForegroundColor Green
} else {
    Write-Host "Docker build failed!" -ForegroundColor Red
    exit 1
}

# Option to start production containers
if ($StartContainers) {
    $start = "y"
} else {
    $start = Read-Host "Do you want to start the production containers? (y/n)"
}

if ($start -match "^[Yy]") {
    Write-Host "Starting production containers..." -ForegroundColor Blue
    docker-compose -f docker-compose.prod.yml up -d
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Production containers started!" -ForegroundColor Green
        Write-Host "Frontend available at: http://localhost" -ForegroundColor Cyan
    } else {
        Write-Host "Failed to start containers!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "To start production containers later, run:" -ForegroundColor Yellow
    Write-Host "   docker-compose -f docker-compose.prod.yml up -d" -ForegroundColor Yellow
}

Write-Host "Production build completed successfully!" -ForegroundColor Green
