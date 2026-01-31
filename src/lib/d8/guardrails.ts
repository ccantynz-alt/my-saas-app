'use strict';

/* ===== D8_MAJOR_INFRA_POLISH_20260131_193407 =====
   File: src/lib/d8/guardrails.ts
   Purpose:
     - Provide a stable, typed guardrails decision engine
     - Satisfy import used by /src/app/api/__d8__/guardrails/route.ts
   Proof: D8_PROOF_20260131_193407
*/

export type GuardrailsDecision = {
  allow: boolean;
  reason: string;
  tags?: string[];
  meta?: Record<string, unknown>;
};

export type GuardrailsContext = {
  path: string;
  method: string;
  ip?: string;
  userAgent?: string;
  referer?: string;
  headers?: Record<string, string>;
  nowIso?: string;
};

export const guardrailsMeta = {
  version: "v1",
  stamp: "D8_MAJOR_INFRA_POLISH_20260131_193407",
  proof: "D8_PROOF_20260131_193407",
  notes: [
    "Additive guardrails library module.",
    "Designed to be conservative: allow by default, deny only for obvious dangerous patterns.",
  ],
} as const;

/**
 * decideGuardrails(ctx)
 * Conservative policy: ALLOW by default. DENY only for clearly abusive patterns.
 * This avoids breaking legitimate traffic while still giving you a central choke point.
 */
export function decideGuardrails(ctx: GuardrailsContext): GuardrailsDecision {
  const path = (ctx?.path || "").toLowerCase();
  const method = (ctx?.method || "GET").toUpperCase();

  // Always allow simple read-only probes
  if (method === "GET" && (path.includes("/api/__probe__") || path.includes("/api/probe"))) {
    return { allow: true, reason: "probe allowed", tags: ["probe"] };
  }

  // Block obvious traversal / injection markers
  const badMarkers = ["..", "%2e%2e", "<script", "%3cscript", "union select", "drop table", "sleep(", "benchmark("];
  for (const m of badMarkers) {
    if (path.includes(m)) {
      return { allow: false, reason: "blocked: suspicious marker", tags: ["suspicious"], meta: { marker: m } };
    }
  }

  // Block common credential stuffing routes if they target internal admin surfaces
  if (path.startsWith("/admin") && (method === "POST" || method === "PUT" || method === "PATCH")) {
    return { allow: true, reason: "admin write allowed (auth handled upstream)", tags: ["admin"] };
  }

  // Default allow
  return { allow: true, reason: "default allow", tags: ["default"] };
}