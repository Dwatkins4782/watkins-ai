# Backend Dockerfile - Optimized for Railway
FROM node:18-alpine AS builder

WORKDIR /app

# Skip Chromium download (puppeteer) - saves ~500MB and minutes of build time
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_SKIP_DOWNLOAD=true

# Install build deps + OpenSSL for Prisma
RUN apk add --no-cache python3 make g++ openssl openssl-dev

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --no-audit --no-fund

COPY . .

# Cache bust to force fresh build
ARG CACHEBUST=1

RUN npx prisma generate
RUN npm run build
RUN echo "=== dist contents ===" && ls -la dist/

# Production stage
FROM node:18-alpine

WORKDIR /app

# OpenSSL for Prisma, libstdc++ for bcrypt
RUN apk add --no-cache openssl libstdc++

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY package*.json ./

EXPOSE 4000

# Run migrations then start the server
CMD ["sh", "-c", "echo '=== Starting app ===' && npx prisma migrate deploy && echo '=== Prisma done, launching node ===' && node dist/main 2>&1; echo \"=== Node exited with code $? ===\""]
