import type { NextApiRequest } from "next";

export const AUTH_COOKIE_NAME = "mysaas_auth";

/**
 * Minimal prototype auth:
 * - If cookie exists and equals "1", user is "logged in".
 * - Replace with real auth later (NextAuth, Clerk, Supabase, etc.)
 */
export function isAuthedFromReq(req: NextApiRequest | { headers: { cookie?: string } }) {
  const cookieHeader = req.headers.cookie || "";
  return cookieHeader.split(";").some((c) => c.trim() === `${AUTH_COOKIE_NAME}=1`);
}

export function authSetCookieHeader() {
  // HttpOnly: cannot be read by JS (better than localStorage)
  // SameSite=Lax: decent default for most apps
  // Secure: should be true on HTTPS (Vercel is HTTPS)
  return `${AUTH_COOKIE_NAME}=1; Path=/; HttpOnly; SameSite=Lax; Secure`;
}

export function authClearCookieHeader() {
  return `${AUTH_COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax; Secure`;
}
