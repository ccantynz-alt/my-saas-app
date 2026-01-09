import { kv } from "@vercel/kv";
import { auth } from "@clerk/nextjs/server";
import { getUserPlan } from "@/app/lib/plan";

export const LIMITS = {
  free: {
    maxProjects: 1, // change to 2 if you want
    canPublish: false,
    canUseCustomDomains: false,
    priorityAi: false,
  },
  pro: {
    maxProjects: Infinity,
    canPublish: true,
    canUseCustomDomains: true,
    priorityAi: true,
  },
} as const;

export type Plan = "free" | "pro";

export function getLimits(plan: Plan) {
  return plan === "pro" ? LIMITS.pro : LIMITS.free;
}

export async function requireSignedInUserId() {
  const { userId } = auth();
  if (!userId) return { ok: false as const, status: 401, error: "Not signed in." };
  return { ok: true as const, userId };
}

export async function requirePro() {
  const signedIn = await requireSignedInUserId();
  if (!signedIn.ok) return signedIn;

  const plan = await getUserPlan(signedIn.userId);
  if (plan !== "pro") {
    return {
      ok: false as const,
      status: 403,
      error: "Pro required. Please upgrade to Pro.",
    };
  }

  return { ok: true as const, userId: signedIn.userId, plan };
}

// Counts projects per user using KV.
// Uses key format you already had earlier: projects:count:clerk:<userId>
export async function getProjectCount(userId: string) {
  const key = `projects:count:clerk:${userId}`;
  const val = (await kv.get(key)) as number | null;
  return val ?? 0;
}

export async function incrementProjectCount(userId: string) {
  const key = `projects:count:clerk:${userId}`;
  const current = await getProjectCount(userId);
  const next = current + 1;
  await kv.set(key, next);
  return next;
}

export async function ensureCanCreateProject(userId: string) {
  const plan = await getUserPlan(userId);
  const limits = getLimits(plan);
  const count = await getProjectCount(userId);

  if (count >= limits.maxProjects) {
    return {
      ok: false as const,
      status: 403,
      error: `Free plan limit reached (${limits.maxProjects} project). Upgrade to Pro to create more.`,
      plan,
      count,
      maxProjects: limits.maxProjects,
    };
  }

  return { ok: true as const, plan, count, maxProjects: limits.maxProjects };
}
