# Audit Follow-ups — Items Requiring Dedicated Sessions

Below are audit items intentionally left for a dedicated refactor session because they
require the ability to build and test the site locally to validate without breaking
the live deployment.

## Softlogs Audit #1 — Landing page client bundle split (2-4 hrs)

**File:** `src/app/page.tsx`
**Status:** Partial. `useCountUp` hook + data arrays extracted into `src/hooks/`
and `src/data/` (Audit #22 partial credit). Full conversion to server components
deferred.

**What's needed:**

1. Remove `"use client"` from `src/app/page.tsx`
2. Move each section component into its own file under `src/components/landing/`
3. Mark only the truly interactive ones with `"use client"`:
   - `FeatureCarousel` (uses state + interval)
   - `InteractiveDemo` (calculator with state)
   - `FAQ` (open/close state)
   - `Pricing` (annual toggle)
   - `Testimonials` (carousel state)
   - `Navbar` (scroll + mobile menu)
4. Keep these as server components (no `"use client"`):
   - Hero (static)
   - SocialProof
   - AIModules
   - HowItWorks
   - AddOns
   - NoWebsite
   - BuildItYourself
   - PathToFreedom
   - FinalCTA
   - Footer

**Why deferred:** All 14 components currently share an `Icons.*` namespace and
inline CSS variables. Splitting them safely requires running the dev server to
verify each component still renders. Without a working local build environment,
breaking the production landing page is too high a risk.

**Expected savings:** ~40-60KB gzipped JS off initial load.

## Softlogs Audit #2 — Component file split (2-3 hrs)

Same set of changes as #1. The two should be done together.

## Softlogs Audit #20 — Dual frontend deletion (1-2 days)

**Current state:** `frontend/` directory marked deprecated via `DEPRECATED.md`
and excluded from Vercel deploys via `.vercelignore`, and excluded from TypeScript
compilation via `tsconfig.json`.

**What's needed for full removal:**

1. Run `diff -rq src/app frontend/src/app` to surface unique files
2. Migrate any unique features into `src/`
3. Delete `frontend/` entirely
4. Update `docker-compose.yml`, `render.yaml`, build scripts to drop references
5. Update `README.md` and `SETUP_GUIDE.md`

**Why deferred:** Requires feature parity verification with end-to-end testing.
Safe deprecation is in place; deletion is the final cleanup step.
