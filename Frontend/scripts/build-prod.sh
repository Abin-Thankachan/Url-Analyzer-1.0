#!/bin/bash

# Production Build Script for URL Analyzer Frontend
# This script builds and deploys the frontend application for production

set -e

echo "🚀 Starting Production Build for URL Analyzer Frontend"

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo "⚠️  Warning: .env.production not found. Using .env.production.sample as template."
    if [ -f ".env.production.sample" ]; then
        cp .env.production.sample .env.production
        echo "📝 Please edit .env.production with your production values before running this script again."
        exit 1
    fi
fi

# Load production environment variables
if [ -f ".env.production" ]; then
    echo "📖 Loading production environment variables..."
    export $(cat .env.production | grep -v '^#' | xargs)
fi

# Build Docker image
echo "🐳 Building Docker image..."
docker build \
    --build-arg VITE_API_BASE_URL="${VITE_API_BASE_URL}" \
    --build-arg VITE_API_TIMEOUT="${VITE_API_TIMEOUT}" \
    --build-arg VITE_APP_NAME="${VITE_APP_NAME}" \
    --build-arg VITE_APP_VERSION="${VITE_APP_VERSION}" \
    --build-arg VITE_AUTH_STORAGE_KEY="${VITE_AUTH_STORAGE_KEY}" \
    --build-arg VITE_DEBUG_MODE="${VITE_DEBUG_MODE}" \
    --build-arg VITE_ENABLE_ANALYTICS="${VITE_ENABLE_ANALYTICS}" \
    -t url-analyzer-frontend:latest \
    -t url-analyzer-frontend:${VITE_APP_VERSION:-1.0.0} \
    .

echo "✅ Docker image built successfully!"

# Option to start production containers
read -p "🤔 Do you want to start the production containers? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Starting production containers..."
    docker-compose -f docker-compose.prod.yml up -d
    echo "✅ Production containers started!"
    echo "🌐 Frontend available at: http://localhost"
else
    echo "ℹ️  To start production containers later, run:"
    echo "   docker-compose -f docker-compose.prod.yml up -d"
fi

echo "🎉 Production build completed successfully!"
