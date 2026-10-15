import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Edge middleware: security headers only.
 *
 * This previously gated /dashboard/* on a "token" / "auth-token" /
 * "ecrh_session" cookie — but the app never sets any cookie. The session JWT
 * lives in localStorage (src/lib/store.ts), which edge middleware cannot read.
 * Result: every successful login did `window.location.href = "/dashboard"`,
 * the middleware saw no cookie, and bounced the user straight back to
 * /auth/login. Nobody could reach the dashboard (or billing).
 *
 * Auth is enforced where it actually matters:
 *   - the backend API requires a valid JWT on every protected route, and
 *   - src/app/dashboard/layout.tsx redirects unauthenticated users client-side.
 */
export function middleware(_req: NextRequest) {
  const res = NextResponse.next();
  res.headers.set("X-Frame-Options", "SAMEORIGIN");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=()"
  );
  return res;
}

export const config = {
  matcher: [
    // Apply security headers everywhere except _next internals & static assets
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
};
