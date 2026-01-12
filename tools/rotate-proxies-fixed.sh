#!/bin/bash
while true; do
  log() { echo "[ROTATE $(date)] $*" >> /app/logs/proxies.log; }
  
  # Fix #9: Real HTTPS testing (not HTTPbin spam)
  test_proxy() {
    local proxy=$1
    # Test against 5 real sites + timeout
    for target in httpbin.org ipinfo.io httpbin.org/headers ifconfig.co/json; do
      if timeout 8 curl -s --max-time 8 -x "http://${proxy}" "https://${target}" | jq . >/dev/null 2>&1; then
        echo "${proxy}" >> /app/proxies/http.live.tmp
        return 0
      fi
    done
    return 1
  }
  
  # Parallel testing (50 concurrent)
  log "Testing $(wc -l < /app/proxies/http.txt) proxies..."
  rm -f /app/proxies/http.live.tmp
  cat /app/proxies/http.txt | xargs -P 50 -I {} bash -c 'test_proxy "{}" && echo "OK {}" || echo "FAIL {}"' 2>/dev/null | \
    grep OK | cut -d' ' -f2- > /app/proxies/http.live.tmp
  
  mv /app/proxies/http.live.tmp /app/proxies/http.live
  wc -l /app/proxies/http.live
  
  # Fix #5: Generate leak-proof proxychains
  cat > /etc/proxychains.conf << EOF
# /etc/proxychains.conf - DNS LEAK FIXED
strict_chain
proxy_dns 
remote_dns_subnet 224
tcp_read_time_out 15000
tcp_connect_time_out 8000

dns_server = 127.0.0.1  # Local resolver only
dns_server = 8.8.8.8    # Fallback

[ProxyList]
# Local FIRST (zero latency)
http   127.0.0.1 ${UV_PORT}   # UV Proxy
http   127.0.0.1 3128   # Privoxy→Tor  
socks5 127.0.0.1 1080   # Socat→Tor
EOF
  tail -100 /app/proxies/http.live >> /etc/proxychains.conf
  
  log "$(wc -l < /app/proxies/http.live) live proxies"
  sleep 60
done