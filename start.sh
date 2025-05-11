#!/bin/bash

# Set default mode
MODE="production"

# Get the directory of the script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$SCRIPT_DIR"

# Parse command line arguments
while [[ "$#" -gt 0 ]]; do
    case $1 in
        -d|--dev|--development) MODE="development" ;;
        -p|--prod|--production) MODE="production" ;;
        -h|--help) 
            echo "Usage: ./start.sh [OPTIONS]"
            echo "Options:"
            echo "  -d, --dev, --development    Start in development mode"
            echo "  -p, --prod, --production    Start in production mode (default)"
            echo "  -h, --help                  Show this help message"
            exit 0
            ;;
        *) echo "Unknown parameter: $1"; exit 1 ;;
    esac
    shift
done

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo "Error: Docker is not running or not installed"
        echo "Please start Docker and try again"
        exit 1
    fi
}

# Start in development mode
start_dev() {
    echo "Starting in DEVELOPMENT mode..."
    docker-compose -f docker-compose.dev.yml up --build
}

# Start in production mode
start_prod() {
    echo "Starting in PRODUCTION mode..."
    docker-compose -f docker-compose.yml up --build
}

# Main execution
check_docker

if [ "$MODE" = "development" ]; then
    start_dev
else
    start_prod
fi
