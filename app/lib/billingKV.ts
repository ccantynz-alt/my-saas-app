/**
 * billingKV.ts
 *
 * Minimal billing subscription helpers.
 * This exists mainly to unblock builds where other files import getSubscription().
 *
 * You can later replace this with your real Stripe/Vercel KV billing logic.
 */

export type BillingSubscription = {
  status: "active" | "trialing" | "canceled" | "incomplete" | string;
  currentPeriodEnd?: string | number | null;
  plan?: string | null;
};

/**
 * Return the current user's subscription info.
 * Stub implementation: defaults to "active" so builds and protected routes work.
 *
 * Replace this with real billing logic later.
 */
export async function getSubscription(_userId: string): Promise<BillingSubscription> {
  return { status: "active" };
}
