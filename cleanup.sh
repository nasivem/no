#!/bin/bash

# Stop all containers based on doge-unblocker image
docker stop $(docker ps -q --filter ancestor=doge-unblocker)

# Prune Docker system (remove unused containers, networks, images, etc.)
docker system prune -af

# Clear iptables chains
iptables -F && iptables -t nat -F