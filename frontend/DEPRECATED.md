# ⚠️ This directory is DEPRECATED

**Status:** Archived. Not deployed.
**Date deprecated:** April 26, 2026
**Audit reference:** Softlogs Audit #9, #20

## Why

The repository previously contained two parallel Next.js frontend trees:

- `/src/` ← **canonical, deployed to ecomrevhub.com via Vercel project `frontend`**
- `/frontend/src/` ← this directory; historical fork, no longer deployed

Maintaining both caused feature drift and ambiguous deployment paths.

## What to do

- **New code:** add it under `/src/` (project root).
- **Bug fixes:** apply to `/src/`. Do NOT modify files in this directory.
- **Reference only:** files here are kept for historical reference and to allow comparison
  during the consolidation review.

## When this directory will be deleted

After a full feature-parity audit confirming `/src/` contains every unique feature
from `/frontend/src/`. Run this command to compare:

```bash
diff -rq src/app frontend/src/app
```

Any unique files in `/frontend/src/` should be migrated to `/src/` before deletion.

## Excluded from builds

- `.vercelignore` excludes this directory from Vercel deploys
- `tsconfig.json` excludes this directory from TypeScript compilation
- `next.config.js` has it in `excludeDefaultMomentLocales` patterns
