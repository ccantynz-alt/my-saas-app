import { kv } from "@vercel/kv";

/**
 * Get the plan for a Clerk user.
 * Defaults to "free".
 */
export async function getPlanForUser(
  userId: string
): Promise<"free" | "pro"> {
  const plan = (await kv.get<string>(`plan:clerk:${userId}`)) || "free";
  return plan === "pro" ? "pro" : "free";
}

/**
 * Enforce project limits.
 * Free = 1 project
 * Pro = unlimited
 */
export async function enforceProjectLimit(userId: string): Promise<void> {
  const plan = await getPlanForUser(userId);

  if (plan === "pro") return;

  const count =
    (await kv.get<number>(`projects:count:${userId}`)) || 0;

  if (count >= 1) {
    throw new Error(
      "Free plan limit reached: 1 project. Upgrade to Pro."
    );
  }
}

/**
 * Increment project count after creation.
 */
export async function incrementProjectCount(
  userId: string
): Promise<number> {
  const key = `projects:count:${userId}`;
  const next = await kv.incr(key);
  return next;
}
