# Url-Analyzer Monorepo

This repository is organized as a **monorepo** containing both the backend (Python/FastAPI) and frontend (React/TypeScript) applications for the Url-Analyzer project.

---

## Project Structure

```
.
├── Backend/   # FastAPI backend, database, migrations, Docker, etc.
└── Frontend/  # React frontend, Vite, TailwindCSS, etc.
```

---

## Getting Started

### Prerequisites
- [Python 3.10+](https://www.python.org/downloads/)
- [Node.js 18+](https://nodejs.org/)
- [pnpm](https://pnpm.io/) (or npm/yarn)
- [Docker](https://www.docker.com/) (optional, for containerized setup)

---


## Backend

Essential commands:

```bash
cd Backend
python -m venv venv
. venv/Scripts/activate  # Windows
pip install -r requirements.txt
python server.py
```

For environment variables, copy `dev.env.sample` to `.env` and edit as needed.

Database migrations:
```bash
alembic upgrade head
```

Docker (optional):
```bash
docker-compose up --build
```

---


## Frontend

Essential commands:

```bash
cd Frontend
npm install
npm run dev
```

---

## Development Workflow
- Use separate terminals for backend and frontend development.
- Update the respective `.env` files for configuration.
- PRs and issues should reference the affected package (`Backend` or `Frontend`).

---

## Contributing
1. Fork the repo and create your branch from `master`.
2. Make your changes in the appropriate package folder.
3. Test your changes locally.
4. Submit a pull request.

---

## License
[MIT](LICENSE)
