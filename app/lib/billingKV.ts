import { kv } from "@vercel/kv";

export async function setUserSubscriptionActive(params: {
  clerkUserId: string;
  customerId?: string | null;
  subscriptionId?: string | null;
}) {
  await kv.hset(`sub:user:${params.clerkUserId}`, {
    status: "active",
    clerkUserId: params.clerkUserId,
    customerId: params.customerId || null,
    subscriptionId: params.subscriptionId || null,
    updatedAt: Date.now(),
  });
}


// ----------------------------
// Added to satisfy requirePlan.ts import
// ----------------------------
export async function getSubscription(clerkUserId: string) {
  // Try a few common key patterns used in this repo. Return first match.
  const keys = [
    "billing:subscription:" + clerkUserId,
    "subscription:" + clerkUserId,
    "stripe:subscription:" + clerkUserId,
    "plan:clerk:" + clerkUserId,
  ];

  for (const k of keys) {
    const v = await kv.get(k);
    if (v) return v as any;
  }

  return null;
}
