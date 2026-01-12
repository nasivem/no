# Fetch fresh proxies
curl https://api.proxyscrape.com/v2/?request=get&protocol=http&timeout=10000 -o proxies.txt

# Build (one-time)
docker build -t doge-unblocker .

# Run (single container, all ports exposed)
docker run -d --name doge-proxy -p 3000:3000 -p 8080:8080 -v $(pwd)/proxies.txt:/app/proxies.txt doge-unblocker

# Test chain
proxychains curl -x http://localhost:3000 https://ifconfig.me
curl http://localhost:8080/  # Bare TCP/UDP backend
python3 proxy-rotator.py https://httpbin.org/ip  # Rotator test

# Railway (push this dir)
railway up  # Auto-builds from git/Dockerfile

# Ngrok (local tunnel)
ngrok http 3000  # Web proxy
ngrok tcp 8080   # Bare backend tunnel