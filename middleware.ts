import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Minimal middleware: do NOT call Clerk auth().protect() here.
// We handle auth inside API routes / pages as needed.

export function middleware(_req: NextRequest) {
  return NextResponse.next();
}

// Apply to everything except Next.js internals and static files
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
