// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 🚨 NO-OP middleware
// This prevents MIDDLEWARE_INVOCATION_FAILED by ensuring middleware never throws.
// Once stable, we can re-introduce auth protection safely (e.g. only for /projects).
export function middleware(_req: NextRequest) {
  return NextResponse.next();
}

// Match everything (safe with no-op).
export const config = {
  matcher: ["/:path*"],
};
