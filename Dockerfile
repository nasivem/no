FROM node:20-alpine AS base
RUN apk add --no-cache bash curl wget nginx supervisor tor privoxy dumb-init tzdata tini \
    nmap ncat-openbsd socat iptables ip6tables bind-tools jq && \
    npm i -g pm2 yarn @pm2/io

FROM base AS builder
WORKDIR /app
# Fix: Proper V4 repo + submodules
RUN git clone --depth 1 https://github.com/DogeLeader/DogeUnblocker-v4.git . && \
    yarn config set network-timeout 600000 && \
    yarn install --frozen-lockfile --network-timeout 600000 && \
    yarn build --network-timeout 600000

FROM base AS runtime  
WORKDIR /app

# Copy ONLY built artifacts (massive size fix)
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules  
COPY --from=builder /app/package.json ./
COPY --from=builder /app/server ./server

# Fix: Runtime configs + healthchecks
COPY configs/ ./configs/
COPY tools/ ./tools/
COPY entrypoint-fixed.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh /app/tools/*

# Pre-warm proxy lists + Tor fingerprints
RUN mkdir -p /app/proxies /app/logs /app/certs && \
    touch /app/proxies/{http,https,socks4,socks5}.live

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

EXPOSE 80 443 3000 8080 9050 3128 1080
ENTRYPOINT ["/sbin/tini", "--", "/entrypoint.sh"]