#!/bin/bash
set -euo pipefail

export UV_PORT=${UV_PORT:-3000}
export BARE_PORT=${BARE_PORT:-8080}
export TOR_PORT=${TOR_PORT:-9050}
export HTTP_PORT=${HTTP_PORT:-80}

log() { echo "[$(date)] $*" | tee -a /app/logs/entrypoint.log; }

# Fix #8: Dynamic port detection
while netstat -tln | grep -q ":${UV_PORT} "; do ((UV_PORT++)); done
while netstat -tln | grep -q ":${BARE_PORT} "; do ((BARE_PORT++)); done
log "Using ports UV:${UV_PORT} Bare:${BARE_PORT}"

# Fix #2: Background proxy rotator (no blocking)
tools/rotate-proxies-fixed.sh &
ROTATOR_PID=$!

# Fix #10: Proper service sequencing
log "Starting Tor..."
tor -f configs/torrc-fixed.conf &
TOR_PID=$!
sleep 5  # Bridge handshake

log "Starting proxies..."
privoxy --pidfile /app/logs/privoxy.pid configs/privoxy.conf &
socat TCP-LISTEN:1080,reuseaddr,fork SOCKS4A:127.0.0.1:${TOR_PORT},socksport=9050 &

# Fix #7: PM2 clustering (no leaks)
log "Starting Bare server (PM2 cluster)"
pm2 start server/index.js --name bare --instances max -- -p ${BARE_PORT} --log /app/logs/bare.log
sleep 3

log "Starting UV frontend (PM2)"
pm2 start configs/pm2-uv.json --env production
sleep 5

log "Starting Nginx reverse proxy"
nginx -g 'daemon off; error_log /app/logs/nginx_error.log;'

# Fix #4: Healthcheck endpoint
while true; do
  if curl -f -m 5 http://localhost:${UV_PORT}/health 2>/dev/null; then
    log "✅ All services healthy"
  else
    log "❌ Healthcheck failed, restarting..."
    pm2 restart all
  fi
  sleep 30
done