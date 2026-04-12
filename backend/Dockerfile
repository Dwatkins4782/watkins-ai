FROM node:18-slim

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci --no-audit --no-fund

COPY prisma ./prisma/
RUN npx prisma generate

COPY . .
RUN npm run build

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
