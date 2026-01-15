import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * SAFE middleware:
 * - Never blocks /api/*
 * - Allows POST, GET, etc
 * - Prevents auth/method interference
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // NEVER intercept API routes
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
