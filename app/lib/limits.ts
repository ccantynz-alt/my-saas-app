import { auth } from "@clerk/nextjs/server";
import { kv } from "@vercel/kv";
import { getUserPlan } from "./plan";

/**
 * Plan limits (backend-enforced)
 */
export const LIMITS = {
  free: {
    maxProjects: 1,
    canPublish: false,
    canCustomDomain: false,
  },
  pro: {
    maxProjects: Infinity,
    canPublish: true,
    canCustomDomain: true,
  },
} as const;

export type PlanName = "free" | "pro";

export function requireSignedInUserId(): string {
  const { userId } = auth();
  if (!userId) {
    // 401 Unauthorized
    throw Object.assign(new Error("Unauthorized"), { status: 401 });
  }
  return userId;
}

export async function getEffectivePlan(clerkUserId: string): Promise<PlanName> {
  const plan = await getUserPlan(clerkUserId);
  return plan === "pro" ? "pro" : "free";
}

export async function requirePro(clerkUserId: string): Promise<void> {
  const plan = await getEffectivePlan(clerkUserId);
  if (plan !== "pro") {
    // 403 Forbidden
    throw Object.assign(new Error("Pro plan required"), { status: 403 });
  }
}

/**
 * We maintain a per-user set of projectIds.
 * Key: projects:byUser:<clerkUserId>  (Redis Set)
 */
function userProjectsKey(clerkUserId: string) {
  return `projects:byUser:${clerkUserId}`;
}

export async function getProjectCount(clerkUserId: string): Promise<number> {
  // SCARD returns cardinality of set
  const count = await kv.scard(userProjectsKey(clerkUserId));
  return typeof count === "number" ? count : 0;
}

export async function trackProjectForUser(clerkUserId: string, projectId: string): Promise<void> {
  // SADD is idempotent (won’t duplicate)
  await kv.sadd(userProjectsKey(clerkUserId), projectId);
}

export async function ensureCanCreateProject(clerkUserId: string): Promise<void> {
  const plan = await getEffectivePlan(clerkUserId);
  const limit = LIMITS[plan].maxProjects;

  if (limit === Infinity) return;

  const count = await getProjectCount(clerkUserId);
  if (count >= limit) {
    // 403 Forbidden
    throw Object.assign(new Error(`Free plan limit reached (max ${limit} project). Upgrade to Pro.`), {
      status: 403,
    });
  }
}

/**
 * Helper to convert thrown errors above into consistent JSON responses.
 * Use this in route handlers.
 */
export function toJsonError(err: any) {
  const status = typeof err?.status === "number" ? err.status : 500;
  const message =
    typeof err?.message === "string" ? err.message : "Internal server error";

  return { status, body: { ok: false, error: message } };
}
