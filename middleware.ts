import { NextRequest, NextResponse } from "next/server";

/**
 * IMPORTANT:
 * This middleware is intentionally minimal and SAFE.
 * It prevents domain-routing logic from breaking /api routes.
 *
 * If you previously had domain routing in middleware, it was rewriting /api/*
 * which caused your API calls to return HTML ("Domain not connected").
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ Never run middleware logic on Next internals or API routes
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/robots.txt") ||
    pathname.startsWith("/sitemap.xml")
  ) {
    return NextResponse.next();
  }

  // ✅ For now, do nothing else. Let Next handle routing normally.
  // (We can re-add custom domain routing AFTER the customer flow works.)
  return NextResponse.next();
}

export const config = {
  // Run on everything EXCEPT Next internals & common static assets.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
