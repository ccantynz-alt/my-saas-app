import { kv } from "@/app/lib/kv";

function key(userId: string) {
  return `billing:subscription:${userId}`;
}

export async function setSubscription(userId: string, data: any) {
  await kv.set(key(userId), data);
}

export async function getSubscription(userId: string) {
  return await kv.get(key(userId));
}
