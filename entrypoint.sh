#!/bin/sh
set -e

# Auto-configure based on env vars
export UV_PORT=${UV_PORT:-3000}
export BARE_PORT=${BARE_PORT:-8080}
export TOR_PORT=${TOR_PORT:-9050}
export PROXY_PORT=${PROXY_PORT:-3128}

# Dynamic proxy rotation (every 30s)
./tools/rotate-proxies.sh &

# Start Tor + bridges
tor -f /app/configs/torrc &
privoxy -f /app/configs/privoxy.conf &
socat TCP-LISTEN:1080,fork SOCKS4A:127.0.0.1:tor:9050,socksport=9050 &

# Stack services
supervisord -c /app/configs/supervisord.conf

# Healthcheck endpoint
while true; do
  curl -f http://localhost:${UV_PORT}/health || exit 1
  sleep 30
done