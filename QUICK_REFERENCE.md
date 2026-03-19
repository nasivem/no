# 🚀 DogeUnblocker v4.2 - Quick Reference

## ⚡ 60-Second Deployment

```bash
git clone https://github.com/noboyorg/no.git && cd no
docker build -t doge-unblocker .
docker run -d --name doge -p 8080:80 -p 3000:8000 -p 8081:3128 -p 9050:9050 \
  -v ./logs:/app/logs -v ./proxies:/app/proxies doge-unblocker
sleep 5 && curl http://localhost:8080/health
```

## 📍 Access Points

| URL | Purpose |
|-----|---------|
| `http://localhost:8080` | 🎮 Gaming Hub + Main Dashboard |
| `http://localhost:3000` | 🔗 UV Web Proxy |
| `http://localhost:8081` | 📡 Privoxy HTTP Proxy |
| `127.0.0.1:9050` | 🔐 Tor SOCKS5 |

## 🎯 Share with Classmates

Get your IP: `hostname -I | awk '{print $1}'`

Share: `http://192.168.1.105:8080` (replace with YOUR IP)

## 🛠️ Fix ChromeOS Port Forwarding

Settings → Linux → Port forwarding → Add:
- Container 80 → Host 8080 (TCP)
- Container 3000 → Host 3000 (TCP)
- Container 8080 → Host 8081 (TCP)
- Container 9050 → Host 9050 (TCP)

## 📚 Documentation

| File | Purpose |
|------|---------|
| `CHROMEBOOK_DEPLOYMENT.md` | Initial Chromebook setup |
| `SETUP_VERIFICATION.md` | Complete troubleshooting guide |
| `FIXES_SUMMARY.md` | Overview of all fixes |
| `README.md` | Enhanced with port forwarding guide |

## ✅ Verification

```bash
docker ps | grep doge           # Container running?
curl http://localhost:8080/health # Health check
curl -s http://localhost:3000/    # UV Proxy responding?
```

## 🎮 Features

- ✅ 6 working navigation buttons
- ✅ 8 search engines (Google, Bing, DuckDuckGo, etc.)
- ✅ GeForce NOW integration
- ✅ Gaming hub (50+ games)
- ✅ Tor anonymous routing
- ✅ Bare TCP/UDP proxy
- ✅ Health status monitoring

## 🆘 One-Click Emergency Fix

```bash
docker stop doge && docker rm doge && docker rmi doge-unblocker
docker build -t doge-unblocker . && \
docker run -d --name doge -p 8080:80 -p 3000:8000 -p 8081:3128 -p 9050:9050 \
  -v ./logs:/app/logs -v ./proxies:/app/proxies doge-unblocker
docker logs -f doge
```

## 🔍 Files Changed

- ✅ `index.html` - Modern gaming dashboard
- ✅ `geforce.html` - GeForce NOW integration
- ✅ `payloads.json` - 8 search engines
- ✅ `README.md` - Port forwarding guide
- ✅ `entrypoint.sh` - Simplified startup
- ✅ `Dockerfile` - Fixed packages

---

**🎉 All 4 major fixes deployed! Ready to use!**
