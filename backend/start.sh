#!/bin/sh
set -e

echo "=== START.SH RUNNING ==="
echo "Node version: $(node --version)"
echo "Working dir: $(pwd)"
echo "dist/main.js exists: $(test -f dist/main.js && echo YES || echo NO)"

echo "=== Running Prisma migrate ==="
npx prisma migrate deploy

echo "=== Starting Node ==="
exec node dist/main
