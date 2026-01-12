#!/bin/bash
# FIXED deploy-doge-v5.sh - Uses working Doge Unblocker V4/V5 fork (no dead Bare-server)
# Bare-server discontinued; repos bundle it via npm (@bare-server/node or CDN)
# Run: chmod +x deploy-doge-v5-fixed.sh && ./deploy-doge-v5-fixed.sh

set -e

echo "[+] Deploying Doge Unblocker V5 (fixed - no Bare-server clone needed)..."

mkdir -p ~/doge-v5 && cd ~/doge-v5

# Use active V4/V5-equivalent repo with bundled deps
REPO="https://github.com/jkjkjiin/doge-ub"  # Claims V5, credits DogeNetwork
if [ ! -d "doge-ub" ]; then
  git clone $REPO doge-ub
  cd doge-ub && npm install && cd ..
else
  cd doge-ub && git pull && npm install && cd ..
fi

# Alt fallback: LyraStudios V3 (working package.json pulls Bare via npm)
# git clone https://github.com/LyraStudios/dogeunblocker-v3 doge-v3

# Config for pentest (WSS/obfuscation)
cat > doge-ub/config.yml << 'EOF'
ultraviolet:
  port: 3000
  bare: "/bare/"
  bundle: true
  wss: true
EOF

cd doge-ub

echo "[+] Starting Doge V5 (port 3000)..."
npm start &
PID=$!

echo "[+] Live at: http://localhost:3000"
echo "[+] Proxychains: 'http 127.0.0.1 3000'"
echo "[+] Ctrl+C to stop"

# Ngrok?
read -p "Ngrok tunnel? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
  sudo apt update && sudo apt install ngrok -y
  ngrok http 3000 &
fi

wait $PID proxychains nmap -sV --proxy http://127.0.0.1:3000 target.com
# UI auto-proxies any URL git clone https://github.com/jkjkjiin/doge-ub
cd doge-ub
docker build -t doge-v5 .
docker run -p 3000:3000 doge-v5