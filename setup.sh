#!/bin/bash

# Make scripts executable
chmod +x start.sh
chmod +x stop.sh

echo "Scripts are now executable. You can run them with:"
echo "./start.sh --dev    # For development mode"
echo "./start.sh          # For production mode"
echo "./stop.sh           # To stop containers"
