# Portfolio AI Project

A web application with AI chat capabilities, consisting of a React frontend and Node.js backend.

## Docker Setup

This project is containerized using Docker and can be run in both development and production modes.

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Environment Variables

Copy the example environment file and add your own values:

```bash
cp .env.example .env
```

Edit the `.env` file and add your Google API key:

```
GOOGLE_API_KEY=your_google_api_key_here
```

### Running the Application

#### Using the Helper Scripts

For ease of use, helper scripts are provided to start and stop the application.

To start the application:

```bash
# Start in development mode
./start.sh --dev

# Start in production mode (default)
./start.sh
```

To stop the application:

```bash
# Stop development containers
./stop.sh --dev

# Stop production containers (default)
./stop.sh
```

#### Using Docker Compose Directly

**Development Mode:**

```bash
docker-compose -f docker-compose.dev.yml up --build
```

**Production Mode:**

```bash
docker-compose -f docker-compose.yml up --build
```

### Accessing the Application

- Development Mode:

  - Frontend: http://localhost:5173
  - Backend: http://localhost:3000

- Production Mode:
  - Frontend: http://localhost:80
  - Backend: http://localhost:3000

## Running in WSL (Windows Subsystem for Linux)

To run this project in WSL:

1. Clone the repository in your WSL environment:

   ```bash
   git clone <repository-url>
   cd portfolio-ai
   ```

2. Set up environment variables:

   ```bash
   cp .env.example .env
   nano .env  # Edit with your API key
   ```

3. Make the helper scripts executable:

   ```bash
   chmod +x start.sh stop.sh
   ```

4. Start the application:
   ```bash
   ./start.sh --dev  # For development mode
   # OR
   ./start.sh  # For production mode
   ```

## Project Structure

- `frontend/`: React application using Vite
- `backend/`: Node.js backend service
- `docker-compose.yml`: Production Docker Compose configuration
- `docker-compose.dev.yml`: Development Docker Compose configuration
- `start.sh`: Helper script to start the application
- `stop.sh`: Helper script to stop the application

## Development Notes

- In development mode, code changes in both frontend and backend will trigger hot-reloading
- The frontend in development mode uses Vite's development server
- The backend in development mode uses Nodemon for automatic restarts
