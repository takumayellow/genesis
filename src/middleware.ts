import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Auth middleware placeholder.
 *
 * Currently passes through all requests because the app supports a demo mode
 * where Firebase auth is optional.
 *
 * TODO: Add Firebase session cookie verification here when moving to
 * production auth. Example flow:
 *   1. Read the `__session` cookie from the request
 *   2. Verify the cookie with Firebase Admin SDK (via an internal API route)
 *   3. If invalid, redirect to /login
 */
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes (/api/...)
     * - static files (/_next/static/...)
     * - image optimization (/_next/image/...)
     * - favicon and public assets
     */
    "/((?!api|_next/static|_next/image|favicon\\.ico|favicon\\.svg|.*\\.svg$|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.webp$).*)",
  ],
};
