// middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

/**
 * CRITICAL:
 * - Pages API must own /api/*
 * - So middleware must NOT intercept /api routes
 */
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/p(.*)",

  // allow probes to always work
  "/api/__probe__",
]);

export default clerkMiddleware((auth, req: NextRequest) => {
  const { pathname } = req.nextUrl;

  // ✅ Let Pages API handle everything under /api
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Protect non-public pages
  if (!isPublicRoute(req)) {
    auth().protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // run middleware on all routes except Next internals/static
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
