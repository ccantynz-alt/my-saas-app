import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/p(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/__probe__(.*)",
]);

export default clerkMiddleware((auth, req) => {
  if (process.env.NEXT_PUBLIC_DEMO_AUTH === "true") return;
  if (isPublicRoute(req)) return;
  auth().protect();
});

export const config = {
  matcher: [
    // Never run middleware on published sites
    "/((?!p/|_next|.*\\.(?:css|js|json|png|jpg|jpeg|gif|svg|ico|webp|avif|txt|xml|map)).*)",
    "/api/(.*)",
  ],
};
