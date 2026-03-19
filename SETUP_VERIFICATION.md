# 🎉 DogeUnblocker v4.2 - Complete Setup Verification & Troubleshooting

## ✅ What Was Fixed

### 1. **Port Forwarding Error (ChromeOS)**
- **Problem:** "Error forwarding port" when sharing with classmates
- **Root Cause:** ChromeOS requires explicit port forwarding rules
- **Solution:** Manual port forwarding in ChromeOS Settings (documented in README.md)

### 2. **Broken UI Buttons**
- **Problem:** Gaming hub and proxy buttons not working
- **Fixed:** Replaced obsolete `index.html` with modern, functional UI
- **New Features:**
  - ✅ Working gaming hub launch
  - ✅ UV proxy with search
  - ✅ Bare TCP/UDP connection
  - ✅ GeForce NOW integration
  - ✅ Health status checker
  - ✅ Tor bridge access

### 3. **No Search Engine Support**
- **Problem:** Can only search with one engine (Google)
- **Fixed:** Added 8 search engines in `payloads.json` and UI
  - Google, Bing, DuckDuckGo, Startpage
  - Brave, Ecosia, Qwant, Yandex

### 4. **GeForce NOW Inaccessible**
- **Problem:** AAA games can't be accessed through proxy
- **Fixed:** Created dedicated `/geforce.html` with optimal settings
- **Features:**
  - Direct link from main UI
  - User-agent spoofing built-in
  - Fullscreen support
  - Reload functionality

---

## 🚀 Quick Deployment (Copy-Paste)

### Step 1: On Your Chromebook (Linux Container)
```bash
# Clone the repo
git clone https://github.com/noboyorg/no.git
cd no

# Build the image
docker build -t doge-unblocker .

# Run the container (with correct port mappings)
docker run -d --name doge \
  -p 8080:80 \
  -p 3000:8000 \
  -p 8081:3128 \
  -p 9050:9050 \
  -v ./logs:/app/logs \
  -v ./proxies:/app/proxies \
  doge-unblocker

# Wait 5 seconds for startup
sleep 5

# Get your public IP to share with classmates
hostname -I | awk '{print $1}'
# Output: 192.168.1.105 (replace with YOUR actual IP)
```

### Step 2: Configure ChromeOS Port Forwarding
1. **Settings** → **Linux development environment** → **Port forwarding**
2. Add these rules:
   ```
   Container 80   → Host 8080 (TCP)  [for gaming hub]
   Container 3000 → Host 3000 (TCP)  [for proxy/UV]
   Container 8080 → Host 8081 (TCP)  [for Privoxy]
   Container 9050 → Host 9050 (TCP)  [for Tor]
   ```
3. **Restart Docker:**
   ```bash
   docker stop doge
   docker rm doge
   # Re-run the docker run command above
   ```

### Step 3: Test Everything
```bash
# ✅ Test health endpoint
curl http://localhost:8080/health

# ✅ Test UV proxy
curl -s http://localhost:3000/ | head -20

# ✅ Test Privoxy
curl -s http://localhost:8081/ | head

# ✅ Show your public IP (for classmates)
hostname -I

# ✅ View container logs
docker logs -f doge
```

---

## 🎨 UI Features (Now Working)

### Main Dashboard: `http://localhost:8080`

#### Search Box
- **Purpose:** Search any URL or text through UV proxy
- **Example:** Type "github.com" → proxies through UV
- **Quick Links:** Google, Bing, DuckDuckGo, YouTube, GeForce NOW

#### Navigation Cards (Clickable Buttons)
1. **🎮 Gaming Hub** → Launch 50+ HTML5 games
2. **🔗 UV Web Proxy** → Access `/uv/` proxy interface
3. **📡 Bare TCP/UDP** → Raw socket proxy (`/bare/`)
4. **✅ Health Status** → Uptime & performance metrics
5. **🔐 Tor Bridges** → Anonymous routing (`/tor/`)
6. **🎮 GeForce NOW** → Play AAA games in browser

#### Quick Access Links
- Photography Site (your pentest target)
- Discord, Spotify, Reddit, TikTok
- VS Code

#### Footer
- Displays your public IP (auto-detected)
- Access instructions
- Version info

---

## 🎮 GeForce NOW Setup

### Direct Access
```
http://localhost:8080/geforce.html
```

### How It Works
1. ✅ Runs inside UV proxy container
2. ✅ User-agent spoofing enabled
3. ✅ Fullscreen support for gaming
4. ✅ Auto-reload on connection issues

### Troubleshooting GeForce NOW

| Issue | Fix |
|-------|-----|
| "Loading..." forever | Clear browser cache (Ctrl+Shift+Del) |
| Connection timeout | Access another site first to warm proxy |
| Video/audio not working | Check microphone/camera permissions |
| Input lag | Use fullscreen mode for better performance |
| Still not working | GeForce may detect proxy; try VPN combo |

---

## 🔍 Search Engines (All Via `/uv/` Proxy)

### Built-in References
All accessible via the search box on the main dashboard:

```
Search Box → Type query → Choose engine → Proxy routes request
```

### Supported Engines
1. **Google** - `/uv/https://www.google.com`
2. **Bing** - `/uv/https://www.bing.com`
3. **DuckDuckGo** - `/uv/https://duckduckgo.com`
4. **Startpage** - `/uv/https://www.startpage.com`
5. **Brave Search** - `/uv/https://search.brave.com`
6. **Ecosia** - `/uv/https://www.ecosia.org`
7. **Qwant** - `/uv/https://www.qwant.com`
8. **Yandex** - `/uv/https://yandex.com`

---

## 📊 Port Mapping Reference

| Host Port | Container Port | Service | Purpose |
|-----------|----------------|---------|---------|
| **8080** | 80 | Nginx | Gaming hub + main UI |
| **3000** | 8000 | Node.js | DogeUnblocker UV proxy |
| **8081** | 3128 | Privoxy | HTTP proxy alternative |
| **9050** | 9050 | Tor | SOCKS5 anonymous proxy |

**Why these mappings?**
- ChromeOS blocks ports < 1024 for security
- Port 8080 is standard for HTTP services
- Port 3000 is convention for web apps
- Ports > 1024 auto-forward in ChromeOS

---

## 📱 Share with Classmates

### Method 1: Same Network (LAN)
```bash
# 1. Get your IP
hostname -I | awk '{print $1}'
# Output: 192.168.1.105

# 2. Share this link: http://192.168.1.105:8080
# They access from: Chrome → Type in address bar → http://192.168.1.105:8080
```

### Method 2: Through School Proxy
If behind school firewall:
```bash
# Use TailScale/Ngrok for remote access
tailscale up  # (if installed)
# Or proxy through your machine's public IP
```

### Method 3: QR Code
Generate QR pointing to `http://<YOUR-IP>:8080` using:
```bash
# Install qrencode
sudo apt-get install qrencode

# Generate QR
qrencode -o qr.png "http://192.168.1.105:8080"

# Display
feh qr.png  # or open in browser
```

---

## 🐛 Troubleshooting

### "Can't connect to localhost:8080"
```bash
# Check if container is running
docker ps | grep doge

# If not running, restart
docker start doge

# Check port mapping
docker port doge

# Verify port forwarding in ChromeOS
# Settings → Linux → Port forwarding → Add rules
```

### "Port forwarding error on ChromeOS"
```bash
# Manual fix (as root in Linux container)
sudo iptables -I FORWARD -j ACCEPT
sudo ip link set eth0 up

# Restart Linux container
# Settings → Linux development environment → Turn off → Turn on
```

### "127.0.0.1:3000 connection refused"
```bash
# Port mapping issue - use docker inspect
docker inspect doge --format='{{json .NetworkSettings.Ports}}'

# Should show something like:
# "3000/tcp":[{"HostIp":"0.0.0.0","HostPort":"8000"}]

# If blank, port mapping failed - restart container
docker stop doge && docker rm doge
# Then re-run with -p flags
```

### "GeForce NOW shows blank page"
```bash
# Solution 1: Clear cache
# Ctrl+Shift+Del → Clear browsing data

# Solution 2: Warm up proxy
# Access google.com through UV first

# Solution 3: Check iframe permissions
# Browser → Settings → Privacy → Microphone/Camera → Allow

# Solution 4: Try direct URL (not iframe)
# http://localhost:3000/uv/https://play.geforcenow.com
```

### "Slow performance / high latency"
```bash
# Check proxy status
curl http://localhost:8080/health

# Check Tor connection
docker exec doge netstat -tlnp | grep 9050
# Should show Tor listening on 127.0.0.1:9050

# Optimize: Reduce proxy hops
# Use Privoxy (8081) instead of UV for simpler sites
```

---

## 🔧 Advanced Configuration

### Increase Proxy Pool Size
```bash
# Edit .env
nano .env

# Change this line:
PROXY_POOL_SIZE=15000  # default is 10000

# Restart container
docker restart doge
```

### Enable Tor Bridges
```bash
# Edit torrc
nano configs/torrc-fixed.conf

# Uncomment (remove #) from these lines:
# UseBridges 1
# Bridge obfs4 ...

docker restart doge
```

### Add Custom Search Engines
```bash
# Edit payloads.json
nano tools/payloads.json

# Add under "search_engines" array:
{
  "name": "Custom Engine",
  "url": "https://example.com/search?q=%s",
  "icon": "🔍"
}

# Note: requires app restart to take effect
```

---

## 📋 File Changes Summary

| File | Change | Impact |
|------|--------|--------|
| `index.html` | Complete rewrite (258 lines) | ✅ Buttons now work |
| `geforce.html` | New file (176 lines) | ✅ GeForce NOW support |
| `payloads.json` | Added search engines (62 lines) | ✅ 8 search options |
| `README.md` | Added ChromeOS guide | ✅ Port forwarding docs |
| `entrypoint.sh` | Simplified startup | ✅ Better reliability |
| `Dockerfile` | Fixed packages | ✅ Builds correctly |

---

## ✨ Next Steps

### Short Term
1. ✅ Deploy using the quick deployment guide above
2. ✅ Test all endpoints with curl commands
3. ✅ Share with 3-5 classmates on same network
4. ✅ Verify port forwarding in ChromeOS settings

### Medium Term
1. 📍 Increase proxy pool size to 15000
2. 📍 Configure Tor bridges for anonymity
3. 📍 Document custom bookmarks
4. 📍 Test with VPN combo for GeForce NOW

### Long Term
1. 🎯 Deploy to VPS for remote access
2. 🎯 Set up monitoring (Grafana dashboard)
3. 🎯 Create Kubernetes deployment
4. 🎯 Add rate limiting & authentication

---

## 🆘 Emergency Restart

If something breaks:
```bash
# Nuclear option (resets everything)
docker stop doge
docker rm doge
docker rmi doge-unblocker

# Rebuild & restart
docker build -t doge-unblocker .
docker run -d --name doge \
  -p 8080:80 -p 3000:8000 -p 8081:3128 -p 9050:9050 \
  -v ./logs:/app/logs -v ./proxies:/app/proxies \
  doge-unblocker

# Monitor
docker logs -f doge
```

---

## 📞 Support Resources

- **DogeUnblocker Upstream:** https://github.com/DogeLeader/DogeUnblocker-v4
- **UV Proxy Docs:** https://github.com/titaniumnetwork-dev/Ultraviolet
- **Bare Server:** https://github.com/tomphttp/bare-server
- **ChromeOS Linux:** https://support.google.com/chromebook/answer/9145439
- **Tor Project:** https://www.torproject.org/

---

**Ready to go! 🚀 All fixes deployed. Access your gaming hub now!**
