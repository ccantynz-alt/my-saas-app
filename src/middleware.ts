import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }
// Do NOT rewrite/redirect routes here. Just set anti-cache headers.
  const res = NextResponse.next();
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  res.headers.set("Pragma", "no-cache");
  res.headers.set("Expires", "0");
  res.headers.set("Surrogate-Control", "no-store");
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)",
    "/api/__probe__",
    "/api/__ping__",
  ],
};