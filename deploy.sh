#!/bin/bash

# Pull the latest changes from the main branch
git pull origin main

# Stop and restart the docker-compose production stack
docker-compose -f docker-compose.prod.yml down

docker-compose -f docker-compose.prod.yml up -d

# Run healthcheck
# Assuming the healthcheck command is defined in the docker-compose file

# Optionally, you can replace the following line with an actual healthcheck command if needed
# Example: curl -f http://localhost/health || exit 1