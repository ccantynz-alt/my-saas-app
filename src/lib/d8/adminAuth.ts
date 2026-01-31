'use strict';

/* ===== D8_MAJOR_INFRA_POLISH_20260131_193407 =====
   File: src/lib/d8/adminAuth.ts
   Purpose:
     - Optional, header-based admin protection helper for internal routes.
     - Additive only; routes must explicitly use it.
   Env:
     - D8_ADMIN_KEY (if set, requests must include x-d8-admin-key matching)
   Proof: D8_PROOF_20260131_193407
*/

export function requireAdminKey(headers: Headers): { ok: boolean; reason: string } {
  const expected = process.env.D8_ADMIN_KEY || "";
  if (!expected) return { ok: true, reason: "no admin key configured (open)" };

  const got = headers.get("x-d8-admin-key") || "";
  if (got !== expected) return { ok: false, reason: "missing/invalid x-d8-admin-key" };

  return { ok: true, reason: "admin key ok" };
}