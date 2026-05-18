# Environment Variables

Every variable required for EcomRevHub to run. Backend (`.env`) and frontend (`.env.local`) are separate — don't mix them in one file.

## Backend (`.env` — Railway)

### Required for startup
```bash
PORT=4000
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/dbname?schema=public
JWT_SECRET=          # 64+ random chars. Generate: openssl rand -hex 64
FRONTEND_URL=https://ecomrevhub.com
```

### Required for dropshipping (AUDIT #14 — new in v2)
```bash
# AES-256-GCM key for encrypting supplier API credentials at rest.
# WITHOUT THIS, the backend fails closed on first request to /api/v1/dropshipping/*
# in production (intentional). Generate with:
#   openssl rand -base64 32
ENCRYPTION_KEY=
```

**What breaks if missing in production:** `EncryptionService` constructor throws
on app boot. The error is loud and traceable. Set this BEFORE the first deploy
that includes commit `98ca9ae` or later.

**Key rotation:** scrypt-derived from your raw key plus a fixed salt
(`ecrh-encryption-salt-v1`). Rotating the env var invalidates every existing
encrypted credential — re-enter all supplier API keys after a rotation.

### Required for Stripe
```bash
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_STARTER=price_...
STRIPE_PRICE_GROWTH=price_...
STRIPE_PRICE_PROFESSIONAL=price_...
STRIPE_PRICE_ENTERPRISE=price_...
```

### Required for AI
```bash
AZURE_OPENAI_API_KEY=
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o
AZURE_OPENAI_API_VERSION=2024-02-15-preview
```

### Optional — enables features when set
```bash
REDIS_HOST=               # If unset, BullMQ queue is disabled and emails send synchronously
REDIS_PORT=6379
REDIS_PASSWORD=

SENDGRID_API_KEY=         # If unset, emails are logged but not delivered

SHOPIFY_API_KEY=          # OAuth flow for Shopify store connections
SHOPIFY_API_SECRET=
```

## Frontend (`.env.local` — Vercel)

```bash
NEXT_PUBLIC_API_URL=https://api.ecomrevhub.com/api/v1
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

## Pre-deploy checklist

Before promoting a build to production, verify:

- [ ] `ENCRYPTION_KEY` is set in Railway (or backend will crash on dropshipping requests)
- [ ] `JWT_SECRET` is not the default placeholder
- [ ] `DATABASE_URL` points at production DB, not dev
- [ ] `FRONTEND_URL` matches the actual customer-facing origin
- [ ] `STRIPE_SECRET_KEY` starts with `sk_live_` not `sk_test_`
- [ ] `NEXT_PUBLIC_API_URL` matches your backend URL

## Generating secure values

```bash
# JWT_SECRET (64-char hex)
openssl rand -hex 64

# ENCRYPTION_KEY (32-byte base64)
openssl rand -base64 32

# Both, on Windows PowerShell:
[Convert]::ToBase64String((1..32 | %{Get-Random -Min 0 -Max 256}))
```

## Where each variable is consumed

| Variable | File |
|---|---|
| `ENCRYPTION_KEY` | `backend/src/common/services/encryption.service.ts` |
| `JWT_SECRET` | `backend/src/auth/auth.module.ts` |
| `DATABASE_URL` | `backend/prisma/schema.prisma` |
| `FRONTEND_URL` | `backend/src/auth/auth.service.ts` (reset/verify links) |
| `STRIPE_*` | `backend/src/billing/billing.service.ts` |
| `AZURE_OPENAI_*` | `backend/src/ai/ai.service.ts` |
| `NEXT_PUBLIC_API_URL` | `src/lib/api.ts` |
