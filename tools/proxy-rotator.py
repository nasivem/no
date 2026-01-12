#!/usr/bin/env python3
import requests, sys, time
from itertools import cycle

proxies = []
with open('/app/proxies.txt') as f: proxies = [l.strip() for l in f if l.strip()]
proxy_pool = cycle(proxies)

def req(url, method='GET'):
    proxy = next(proxy_pool)
    try:
        resp = requests.request(method, url, proxies={'http': f'http://{proxy}', 'https': f'http://{proxy}'}, timeout=10)
        return resp
    except: return req(url, method)  # Rotate on fail

if __name__ == '__main__':
    url = sys.argv[1] if len(sys.argv)>1 else 'https://httpbin.org/ip'
    print(req(url).text)