FROM node:20-alpine

# Install curl for health checks
RUN apk add --no-cache curl

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Pentest-only user
RUN addgroup -g 1001 pentest && adduser -D -u 1001 -G pentest pentest
USER pentest

COPY server.cjs .
EXPOSE 1337

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/ || exit 1

CMD ["node", "server.cjs"]