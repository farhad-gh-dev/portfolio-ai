#!/bin/bash

# Get the directory of the script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$SCRIPT_DIR"

# Parse command line arguments
MODE="production"
while [[ "$#" -gt 0 ]]; do
    case $1 in
        -d|--dev|--development) MODE="development" ;;
        -p|--prod|--production) MODE="production" ;;
        -h|--help) 
            echo "Usage: ./stop.sh [OPTIONS]"
            echo "Options:"
            echo "  -d, --dev, --development    Stop development containers"
            echo "  -p, --prod, --production    Stop production containers (default)"
            echo "  -h, --help                  Show this help message"
            exit 0
            ;;
        *) echo "Unknown parameter: $1"; exit 1 ;;
    esac
    shift
done

# Stop the appropriate containers
if [ "$MODE" = "development" ]; then
    echo "Stopping DEVELOPMENT containers..."
    docker-compose -f docker-compose.dev.yml down
else
    echo "Stopping PRODUCTION containers..."
    docker-compose -f docker-compose.yml down
fi
