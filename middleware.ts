import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/", // marketing home (if you have it)
  "/api/version(.*)", // allow version checks
  "/p/(.*)", // published renderer should be public
]);

export default clerkMiddleware((auth, req) => {
  // Public routes: let through
  if (isPublicRoute(req)) return;

  // Everything else requires sign-in (including /projects/*)
  auth().protect();
});

export const config = {
  matcher: [
    // Run middleware on all routes except static files
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|map)$).*)",
  ],
};
