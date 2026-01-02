import { getSubscription } from "@/app/lib/billingKV";

export async function requireActivePlan(userId: string) {
  const sub = await getSubscription(userId);
  if (!sub || sub.status !== "active") {
    throw new Error("Upgrade required");
  }
}
