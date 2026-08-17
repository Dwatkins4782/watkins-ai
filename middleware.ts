import { NextResponse } from "next/server";

export function middleware() {
  // Auth gating lives client-side (src/app/dashboard/layout.tsx) because the
  // session token is stored in localStorage, not a cookie — this middleware
  // has no way to read it. A prior version redirected based on a "token"/
  // "auth-token"/"ecrh_session" cookie that nothing ever set, which sent
  // every successful login straight back to /auth/login.
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
    // Apply security headers everywhere except _next internals & static
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
};
