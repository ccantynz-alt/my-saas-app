import { NextRequest, NextResponse } from "next/server";

/**
 * PRIMARY DOMAIN BYPASS (Marketing must work on dominat8.com)
 *
 * If you have custom-domain rewrites (host -> /p/[projectId]),
 * this ensures the primary marketing domains are never rewritten.
 *
 * NOTE:
 * If you previously had more advanced middleware, merge this logic
 * into it later. This version is intentionally conservative.
 */

const PRIMARY_HOSTS = new Set([
  "dominat8.com",
  "www.dominat8.com",
  "localhost",
  "127.0.0.1",
]);

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const host = (req.headers.get("host") || "").toLowerCase().split(":")[0];

  // Allow Vercel preview/prod *.vercel.app to behave normally for marketing.
  // Your custom-domain rewrite logic (if any) should typically *exclude* these anyway.
  if (host.endsWith(".vercel.app")) {
    return NextResponse.next();
  }

  // Primary domain: never rewrite, let marketing routes resolve.
  if (PRIMARY_HOSTS.has(host)) {
    return NextResponse.next();
  }

  // Otherwise: do nothing here.
  // (Your custom-domain rewrite middleware can be re-added/expanded later.)
  return NextResponse.next();
}

// Match everything except Next internals and static assets.
export const config = {
  matcher: ["/((?!_next/|favicon.ico|robots.txt|sitemap.xml).*)"],
};