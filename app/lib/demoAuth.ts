// app/lib/demoAuth.ts
import { headers } from "next/headers";

/**
 * Simple demo auth. Replace later with real auth.
 * We scope everything per "userId" so multi-user is possible later.
 */
export function getCurrentUserId(): string {
  const h = headers();

  // If you ever add auth later, you can forward a header from middleware, etc.
  const fromHeader =
    h.get("x-user-id") || h.get("x-demo-user") || h.get("x-forwarded-user");

  return (fromHeader && fromHeader.trim()) || "demo-user";
}
