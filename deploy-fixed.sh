#!/bin/bash

# Build (2min)
docker build -t doge-unblocker:fixed .

# Run (30s startup)
docker run -d --name doge-pentest \
  --restart unless-stopped \
  -p 3000:3000 -p 8080:8080 -p 9050:9050 -p 3128:3128 \
  -v $(pwd)/logs:/app/logs \
  -v $(pwd)/proxies:/app/proxies \
  doge-unblocker:fixed

# Verify (all green = working)
echo "Container logs:"
docker logs doge-pentest -f &
sleep 5
kill %1

echo "Health check:"
curl http://localhost:3000/health

echo "Proxy test:"
proxychains curl https://ifconfig.me