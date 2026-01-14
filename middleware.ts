// middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getProjectIdForHost, normalizeIncomingHost } from "@/app/lib/domainRoutingStore";

function isPlatformHost(host: string) {
  return (
    host.includes("localhost") ||
    host.includes("127.0.0.1") ||
    host.endsWith(".vercel.app") ||
    host.includes("githubpreview.dev") ||
    host.includes("app.github.dev")
  );
}

function isStaticOrInternalPath(pathname: string) {
  return (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"
  );
}

export async function middleware(req: NextRequest) {
  const xfHost = req.headers.get("x-forwarded-host") || "";
  const hostHeader = req.headers.get("host") || "";
  const host = normalizeIncomingHost(xfHost || hostHeader);

  if (!host || isPlatformHost(host)) {
    return NextResponse.next();
  }

  const { pathname } = req.nextUrl;

  if (isStaticOrInternalPath(pathname)) {
    return NextResponse.next();
  }

  // ✅ Canonicalize: www -> apex (only for custom domains)
  if (host.startsWith("www.")) {
    const apex = host.replace(/^www\./, "");
    const url = req.nextUrl.clone();
    url.hostname = apex;
    // keep path + query
    return NextResponse.redirect(url, 308);
  }

  const projectId = await getProjectIdForHost(host);

  if (!projectId) {
    const url = req.nextUrl.clone();
    url.pathname = "/domain-not-connected";
    return NextResponse.rewrite(url);
  }

  // Avoid loops: if someone hits /p/... on a custom domain, let it render normally
  if (pathname.startsWith("/p/")) {
    return NextResponse.next();
  }

  // Route all custom domain pages to published site root for V1
  const url = req.nextUrl.clone();
  url.pathname = `/p/${projectId}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico|robots.txt|sitemap.xml).*)"],
};
