import { kv } from "@vercel/kv";

export { kv };

export async function kvJsonGet<T>(key: string): Promise<T | null> {
  const v = await kv.get<T>(key);
  return v ?? null;
}

export async function kvJsonSet<T>(key: string, value: T) {
  await kv.set(key, value);
}

export async function kvNowISO() {
  return new Date().toISOString();
}
