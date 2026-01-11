export type AuthResult =
  | { ok: true; userId: string; source: "dev-header" }
  | { ok: false; status: number; error: string };

export async function requireUserId(req: Request): Promise<AuthResult> {
  // Dev-only header auth (matches your locked-in approach)
  if (process.env.NODE_ENV !== "production") {
    const devUser = req.headers.get("x-dev-user");
    if (devUser) {
      return { ok: true, userId: devUser, source: "dev-header" };
    }
    return { ok: false, status: 401, error: "Missing x-dev-user header (dev)" };
  }

  // Production: secure default (until real Clerk auth is wired)
  return { ok: false, status: 401, error: "Unauthenticated" };
}
