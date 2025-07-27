#!/bin/bash
# Docker management script for URL Analyzer

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Commands
case "${1:-help}" in
    "dev")
        print_status "Starting development environment..."
        docker-compose up --build
        ;;
    "prod")
        print_status "Starting production environment..."
        docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
        ;;
    "stop")
        print_status "Stopping all services..."
        docker-compose down
        ;;
    "clean")
        print_status "Stopping and removing all containers, networks, and volumes..."
        docker-compose down -v --remove-orphans
        docker system prune -f
        ;;
    "logs")
        docker-compose logs -f "${2:-app}"
        ;;
    "shell")
        print_status "Opening shell in app container..."
        docker-compose exec app /bin/bash
        ;;
    "db")
        print_status "Connecting to PostgreSQL..."
        docker-compose exec postgres psql -U postgres -d url_analyzer_db
        ;;
    "migrate")
        print_status "Running database migrations..."
        docker-compose exec app alembic upgrade head
        ;;
    "build")
        print_status "Building Docker images..."
        docker-compose build
        ;;
    "help"|*)
        echo "URL Analyzer Docker Management Script"
        echo ""
        echo "Usage: $0 [COMMAND]"
        echo ""
        echo "Commands:"
        echo "  dev      Start development environment with hot reload"
        echo "  prod     Start production environment"
        echo "  stop     Stop all services"
        echo "  clean    Stop and remove all containers, networks, and volumes"
        echo "  logs     Show logs (optional: specify service name)"
        echo "  shell    Open shell in app container"
        echo "  db       Connect to PostgreSQL database"
        echo "  migrate  Run database migrations"
        echo "  build    Build Docker images"
        echo "  help     Show this help message"
        ;;
esac
