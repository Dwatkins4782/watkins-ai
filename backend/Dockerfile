# Backend Dockerfile - Optimized for Railway
FROM node:18-alpine AS builder

WORKDIR /app

# Skip Chromium download (puppeteer) - saves ~500MB and minutes of build time
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_SKIP_DOWNLOAD=true

# Install build dependencies for native modules (bcrypt)
RUN apk add --no-cache python3 make g++

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --no-audit --no-fund

COPY . .

RUN npx prisma generate
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install runtime dependencies for bcrypt
RUN apk add --no-cache libstdc++

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY package*.json ./

EXPOSE 4000

# Run migrations then start the server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
