# URL Content Analyzer API

A FastAPI-based web application that analyzes URL content and extracts the most frequent words from web pages. The application includes user authentication, URL analysis capabilities, and stores analysis history in a PostgreSQL database.

## Features

- 🔐 **User Authentication**: JWT-based authentication system with secure password hashing
- 🌐 **URL Analysis**: Analyze web page content and extract top frequent words
- 📊 **Analysis History**: Store and retrieve analysis history with pagination
- 🗄️ **Database Integration**: PostgreSQL with SQLAlchemy ORM
- 🔄 **Database Migrations**: Alembic for database schema management
- 🐳 **Docker Support**: Complete Docker setup with docker-compose
- 📝 **API Documentation**: Auto-generated OpenAPI/Swagger documentation
- 🧹 **Content Processing**: Beautiful Soup and NLTK for text processing
- ⚙️ **Environment Configuration**: Centralized configuration with validation
- 🔒 **Security**: Environment-based secret management and secure defaults

## Tech Stack

- **Backend**: FastAPI 0.104.1 (Python 3.11+)
- **Database**: PostgreSQL 15
- **ORM**: SQLAlchemy 2.0.23
- **Authentication**: JWT with python-jose and bcrypt
- **Text Processing**: NLTK 3.8.1, Beautiful Soup 4.12.2
- **Server**: Uvicorn with standard features
- **Containerization**: Docker & Docker Compose
- **Migrations**: Alembic 1.13.1

## Project Structure

```
.
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application entry point
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas
│   ├── core/
│   │   ├── __init__.py
│   │   ├── database.py      # Database configuration and session management
│   │   ├── environment.py   # Environment configuration with validation
│   │   └── errors.py        # Custom error handling
│   ├── routers/
│   │   ├── __init__.py      # Main API router configuration
│   │   └── v1/
│   │       ├── auth.py      # Authentication routes (v1)
│   │       └── urls.py      # URL analysis routes (v1)
│   └── services/
│       ├── __init__.py
│       ├── url_analyzer.py  # URL analysis service
│       └── auth/
│           ├── auth.py      # Authentication service
│           └── dependencies.py # Auth dependencies
├── alembic/                 # Database migrations
│   ├── env.py              # Alembic environment configuration
│   ├── script.py.mako      # Migration template
│   └── versions/           # Migration files
├── alembic.ini              # Alembic configuration
├── docker-compose.yml       # Docker Compose configuration
├── docker-compose.prod.yml  # Production Docker Compose
├── Dockerfile               # Docker image configuration
├── requirements.txt         # Python dependencies
├── server.py               # Development server runner
├── prod.env                # Production environment template
└── startup.sh              # Startup script for Docker
```

## Prerequisites

Before running the application, ensure you have the following installed:

- Python 3.11+
- PostgreSQL 15+ (or use Docker)
- Docker & Docker Compose (recommended for development)

## Installation & Setup

### Option 1: Local Development Setup

1. **Clone the repository**
   ```powershell
   git clone <repository-url>
   cd woho
   ```

2. **Create virtual environment**
   ```powershell
   python -m venv venv
   # Activate virtual environment
   venv\Scripts\activate
   ```

3. **Install dependencies**
   ```powershell
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   Create a `.env` file in the root directory, for prod create `prod.env`:
   ```env
   # Database Configuration
   DATABASE_URL=postgresql://username:password@localhost:5432/url_analyzer_db
   
   # JWT Configuration (REQUIRED)
   SECRET_KEY=your-super-secure-secret-key-at-least-32-characters-long
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   
   # Security Settings
   BCRYPT_ROUNDS=12
   
   # Server Configuration
   SERVER_HOST=0.0.0.0
   SERVER_PORT=8000
   SERVER_RELOAD=True
   SERVER_LOG_LEVEL=info
   DEBUG=False
   
   # URL Analyzer Settings
   REQUEST_TIMEOUT=10
   MAX_CONTENT_SIZE=5242880
   USER_AGENT=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
   ```

5. **Set up PostgreSQL database**
   - Install PostgreSQL and create a database named `url_analyzer_db`
   - Update the DATABASE_URL in your `.env` file with your credentials

6. **Download NLTK data**
   ```powershell
   python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"
   ```

7. **Run database migrations**
   ```powershell
   alembic upgrade head
   ```

8. **Start the development server**
   ```powershell
   python server.py
   ```

### Option 2: Docker Setup (Recommended)

1. **Clone the repository**
   ```powershell
   git clone <repository-url>
   cd woho
   ```

2. **Start with Docker Compose**
   ```powershell
   docker-compose up -d
   ```

   This will start:
   - PostgreSQL database on port 5432
   - FastAPI application on port 8000

3. **For production deployment**
   ```powershell
   docker-compose -f docker-compose.prod.yml up -d
   ```

## Running the Application

### Development Server
```powershell
python server.py
```

### Production Server
```powershell
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Docker
```powershell
# Development
docker-compose up
# or 
./docker.ps1 dev

# Production
docker-compose -f docker-compose.prod.yml up -d
# or
./docker.ps1 prod
```

The application will be available at:
- **API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc

## API Documentation

The application provides comprehensive API documentation through:

### Interactive Documentation
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Main Endpoints

#### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login and get access token

#### URL Analysis
- `POST /api/v1/urls/analyze` - Analyze a URL and extract top words
- `GET /api/v1/urls/history` - Get analysis history with pagination

#### Health Check
- `GET /` - Root endpoint with API information
- `GET /health` - Application health status

## Usage Examples

### 1. Register a new user
```powershell
curl -X POST "http://localhost:8000/api/v1/auth/register" `
  -H "Content-Type: application/json" `
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 2. Login
```powershell
curl -X POST "http://localhost:8000/api/v1/auth/login" `
  -H "Content-Type: application/json" `
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

### 3. Analyze a URL
```powershell
curl -X POST "http://localhost:8000/api/v1/urls/analyze" `
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" `
  -H "Content-Type: application/json" `
  -d '{
    "url": "https://example.com"
  }'
```

## Database Management

### Running Migrations
```powershell
# Generate a new migration
alembic revision --autogenerate -m "Description of changes"

# Apply migrations
alembic upgrade head

# Downgrade migrations
alembic downgrade -1

# View migration history
alembic history
```

### Database Schema
The application uses the following main models:
- **User**: User authentication and profile information
- **UrlAnalysis**: Stores URL analysis results and top words

## Docker Configuration

### Building the Image
```powershell
docker build -t url-analyzer .
```

### Running with Docker Compose
```powershell
# Start all services (development)
docker-compose up -d

# Start all services (production)
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up --build
```

### Environment Configuration
The Docker setup includes:
- **PostgreSQL**: Database service on port 5432
- **Application**: FastAPI service on port 8000

### Production Deployment
Use the production docker-compose file for deployment:
```powershell
docker-compose -f docker-compose.prod.yml up -d
```

## Testing

### Running Tests
```powershell
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test file
pytest tests/test_auth.py
```

## Development

### Code Style
The project follows Python best practices:
- PEP 8 style guide
- Type hints for better code documentation
- Pydantic models for data validation
- SQLAlchemy for database operations
- Centralized configuration management
- Secure password hashing with bcrypt

### Project Architecture
- **Core Module**: Central configuration, database, and error handling
- **Services**: Business logic separation (auth, URL analysis)
- **Routers**: API versioning with v1 routes
- **Models**: SQLAlchemy database models
- **Schemas**: Pydantic request/response models

### Adding New Features
1. Create new routes in `app/routers/v1/`
2. Define schemas in `app/schemas.py`
3. Add database models in `app/models.py`
4. Implement business logic in `app/services/`
5. Create database migrations with Alembic
6. Add environment variables to `app/core/environment.py`

### Development Commands
```powershell
# Start development server with auto-reload
python server.py

# Format code (if using black)
black app/

# Check code style (if using flake8)
flake8 app/

# Type checking (if using mypy)
mypy app/
```

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DATABASE_URL` | PostgreSQL connection string | sqlite:///./test.db | No |
| `SECRET_KEY` | JWT secret key (min 32 chars) | None | **Yes** |
| `ALGORITHM` | JWT algorithm | HS256 | No |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiration time | 30 | No |
| `BCRYPT_ROUNDS` | Password hashing rounds | 12 | No |
| `SERVER_HOST` | Server bind address | 0.0.0.0 | No |
| `SERVER_PORT` | Server port | 8000 | No |
| `SERVER_RELOAD` | Auto-reload in development | True | No |
| `SERVER_LOG_LEVEL` | Logging level | info | No |
| `DEBUG` | Debug mode | False | No |
| `REQUEST_TIMEOUT` | HTTP request timeout (seconds) | 10 | No |
| `MAX_CONTENT_SIZE` | Max content size (bytes) | 5242880 | No |
| `USER_AGENT` | HTTP User-Agent string | Mozilla/5.0... | No |

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   ```
   sqlalchemy.exc.OperationalError: (psycopg2.OperationalError)
   ```
   - Ensure PostgreSQL is running
   - Check DATABASE_URL configuration
   - Verify database exists and credentials are correct
   - For Docker: ensure postgres service is healthy

2. **Secret Key Error**
   ```
   EnvironmentError: SECRET_KEY environment variable is required
   ```
   - Set SECRET_KEY in your `.env` file
   - Ensure the key is at least 32 characters long
   - Generate a secure key: `python -c "import secrets; print(secrets.token_urlsafe(32))"`

3. **Module Import Errors**
   ```
   ModuleNotFoundError: No module named 'app'
   ```
   - Ensure virtual environment is activated
   - Install all requirements: `pip install -r requirements.txt`
   - Check your current directory is the project root

4. **Docker Issues**
   - **Port conflicts**: Check if ports 8000 or 5432 are in use
   - **Container build fails**: Rebuild with `docker-compose up --build`
   - **Database not ready**: Wait for postgres health check to pass
   - **Permission issues**: Ensure Docker has necessary permissions

5. **Migration Issues**
   ```
   alembic.util.exc.CommandError: Can't locate revision identified by
   ```
   - Check database connection
   - Ensure migrations directory exists
   - Reset migrations if needed: `alembic stamp head`

### Development Tips

1. **Environment Setup**
   - Always use a virtual environment
   - Copy `.env` as a template for your `.env` file
   - Keep sensitive data out of version control

2. **Database Development**
   - Use Docker for consistent database environment
   - Always create migrations for model changes
   - Test migrations on a copy of production data

3. **API Testing**
   - Use the interactive docs at `/docs` for testing
   - Set up proper authentication tokens for testing
   - Test edge cases and error conditions

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the project structure
4. Add tests for new features
5. Run tests and ensure they pass
6. Update documentation as needed
7. Commit your changes (`git commit -m 'Add amazing feature'`)
8. Push to the branch (`git push origin feature/amazing-feature`)
9. Submit a pull request

### Code Contribution Guidelines
- Follow existing code style and patterns
- Add type hints to all functions
- Write docstrings for new functions and classes
- Update environment variables documentation
- Add migration files for database changes

## Security Considerations

- **Secret Key**: Use a strong, unique secret key in production
- **Database**: Use proper database credentials and connection encryption
- **CORS**: Configure CORS properly for production environments
- **Rate Limiting**: Consider adding rate limiting for production
- **HTTPS**: Always use HTTPS in production
- **Environment Variables**: Never commit sensitive environment variables

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Check the API documentation at `/docs`
- Review the troubleshooting section above
- Check existing issues in the repository
- Create a new issue with detailed information

---

**Happy coding! 🚀**
