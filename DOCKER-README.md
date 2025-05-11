# Portfolio AI Project - Docker Setup

This project uses Docker and Docker Compose to containerize both the frontend and backend services.

## Docker Files Structure

- `docker-compose.yml` - Production configuration
- `docker-compose.dev.yml` - Development configuration
- Backend Dockerfiles:
  - `backend/Dockerfile` - Production build
  - `backend/Dockerfile.dev` - Development build
- Frontend Dockerfiles:
  - `frontend/Dockerfile` - Production build
  - `frontend/Dockerfile.dev` - Development build

## Development Environment

To start the development environment:

```bash
docker compose -f docker-compose.dev.yml up
```

This will:

- Start the backend service on port 3000
- Start the frontend service on port 5173
- Mount your local directories as volumes for hot-reloading

## Production Environment

To start the production environment:

```bash
docker compose up --build
```

This will:

- Build optimized production containers
- Start the backend service on port 3000
- Start the frontend service on port 5173 (can be changed to 80 in production)

## Notes

- The frontend container in production uses Nginx to serve static files
- The backend container runs the compiled Node.js application
- Environment variables can be adjusted in the docker-compose files
