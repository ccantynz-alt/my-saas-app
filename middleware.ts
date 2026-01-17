import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Public routes (extend as needed)
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/__probe_pages__(.*)",
]);

export default clerkMiddleware((auth, req) => {
  // CRITICAL: Do not run auth middleware on ANY /api routes.
  // Agents live under /api and must accept POST.
  if (req.nextUrl.pathname.startsWith("/api")) return;

  if (isPublicRoute(req)) return;

  auth().protect();
});

export const config = {
  // CRITICAL: Exclude /api entirely from middleware matching.
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
