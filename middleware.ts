// middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getProjectIdForHost, normalizeIncomingHost } from "@/app/lib/domainRoutingStore";

function isPlatformHost(host: string) {
  // Treat these as “not a custom domain”
  // Add/remove as needed for your setup
  return (
    host.includes("localhost") ||
    host.includes("127.0.0.1") ||
    host.endsWith(".vercel.app") ||
    host.includes("githubpreview.dev") ||
    host.includes("app.github.dev")
  );
}

export async function middleware(req: NextRequest) {
  const hostHeader = req.headers.get("host") || "";
  const host = normalizeIncomingHost(hostHeader);

  // Skip non-custom hosts
  if (!host || isPlatformHost(host)) {
    return NextResponse.next();
  }

  const { pathname } = req.nextUrl;

  // Skip Next internals / APIs
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"
  ) {
    return NextResponse.next();
  }

  // Only map the root path in V1 (clean + safe)
  if (pathname !== "/") {
    return NextResponse.next();
  }

  const projectId = await getProjectIdForHost(host);

  // If we don’t know the domain yet, don’t break the site
  if (!projectId) {
    return NextResponse.next();
  }

  // Rewrite: example.com/  ->  /p/proj_123
  const url = req.nextUrl.clone();
  url.pathname = `/p/${projectId}`;

  return NextResponse.rewrite(url);
}

// Only run middleware on “pages”, not assets
export const config = {
  matcher: ["/((?!_next|favicon.ico|robots.txt|sitemap.xml|api).*)"],
};
