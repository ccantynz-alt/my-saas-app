/**
 * billingKV.ts
 *
 * Minimal billing subscription helpers.
 * These functions exist to satisfy imports across the app and unblock builds.
 *
 * Replace with real Stripe + KV/DB logic later.
 */

export type BillingSubscription = {
  status: "active" | "trialing" | "canceled" | "incomplete" | string;
  currentPeriodEnd?: string | number | null;
  plan?: string | null;
};

export type UserSubscriptionRecord = BillingSubscription & {
  userId?: string | null;
  clerkUserId?: string | null;
  customerId?: string | null;
  subscriptionId?: string | null;
};

export type ActivateArgs =
  | string
  | {
      clerkUserId?: any;
      customerId?: any;
      subscriptionId?: any;
    };

/**
 * Return the current user's subscription info.
 * Stub implementation: defaults to "active" so protected flows work.
 */
export async function getSubscription(_userId: string): Promise<BillingSubscription> {
  return { status: "active" };
}

/**
 * Mark a user's subscription as active.
 * Accepts either:
 *  - userId string
 *  - object: { clerkUserId, customerId, subscriptionId }
 *
 * Stub implementation: no-op.
 */
export async function setUserSubscriptionActive(
  _arg: ActivateArgs,
  _data?: Partial<UserSubscriptionRecord>
): Promise<void> {
  // no-op (stub)
}

/**
 * Mark a user's subscription as canceled.
 * Stub implementation: no-op.
 */
export async function setUserSubscriptionCanceled(
  _userId: string,
  _data?: Partial<UserSubscriptionRecord>
): Promise<void> {
  // no-op (stub)
}

/**
 * Generic setter if other code paths use a different name.
 * Stub implementation: no-op.
 */
export async function setSubscription(
  _userId: string,
  _subscription: BillingSubscription
): Promise<void> {
  // no-op (stub)
}
