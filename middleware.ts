import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// IMPORTANT:
// We MUST NOT rewrite on platform hosts (vercel.app / localhost / github.dev),
// otherwise normal app routes like /projects/... will 404.
function isPlatformHost(host: string) {
  const h = host.toLowerCase();

  // localhost (dev)
  if (h === "localhost" || h.startsWith("localhost:")) return true;
  if (h === "127.0.0.1" || h.startsWith("127.0.0.1:")) return true;

  // Vercel preview / production hosts
  if (h.endsWith(".vercel.app")) return true;

  // GitHub Codespaces (dev)
  if (h.endsWith(".app.github.dev")) return true;
  if (h.includes(".github.dev")) return true;

  return false;
}

function normalizeHost(host: string) {
  // remove port
  const noPort = host.split(":")[0].toLowerCase().trim();
  // strip leading www.
  if (noPort.startsWith("www.")) return noPort.slice(4);
  return noPort;
}

export async function middleware(req: NextRequest) {
  const hostHeader = req.headers.get("host") || "";
  if (!hostHeader) return NextResponse.next();

  // ✅ Platform hosts: DO NOTHING. Let Next handle normal routes.
  if (isPlatformHost(hostHeader)) {
    return NextResponse.next();
  }

  // From here on: treat as custom domain traffic only
  const host = normalizeHost(hostHeader);

  // Avoid rewriting Next internals
  const { pathname, search } = req.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/robots.txt") ||
    pathname.startsWith("/sitemap") ||
    pathname.startsWith("/domain-not-connected")
  ) {
    return NextResponse.next();
  }

  // --- Custom domain routing ---
  // We try to resolve domain -> projectId via your existing API route.
  // This keeps middleware edge-safe and avoids direct KV access here.
  try {
    const url = new URL(req.url);
    const resolveUrl = new URL("/api/domains/resolve", url.origin);
    resolveUrl.searchParams.set("host", host);

    const r = await fetch(resolveUrl.toString(), {
      method: "GET",
      headers: { "x-middleware-fetch": "1" },
    });

    if (!r.ok) {
      // If resolve endpoint fails, do not break the whole site:
      return NextResponse.rewrite(new URL("/domain-not-connected", req.url));
    }

    const data = (await r.json()) as { ok?: boolean; projectId?: string | null };

    if (!data?.ok || !data?.projectId) {
      return NextResponse.rewrite(new URL("/domain-not-connected", req.url));
    }

    // Preserve path: /pricing -> /p/{projectId}/pricing
    const target = new URL(`/p/${data.projectId}${pathname}${search}`, req.url);
    return NextResponse.rewrite(target);
  } catch {
    return NextResponse.rewrite(new URL("/domain-not-connected", req.url));
  }
}

// Only run middleware for “page” routes.
// (We still early-return for /api above as an extra safety.)
export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
