// app/lib/kv.ts
import "server-only";

type ZAddArg =
  | { score: number; member: string }
  | Array<{ score: number; member: string }>;

type JsonValue = any;

function requiredEnvError() {
  return new Error(
    [
      "KV is not configured.",
      "",
      "Expected one complete REST pair (URL + TOKEN). Supported env var names:",
      "",
      "Vercel/Upstash KV-style:",
      "  - KV_REST_API_URL (or KV_URL) + KV_REST_API_TOKEN",
      "  - Optional: KV_REST_API_READ_ONLY_TOKEN (read-only)",
      "",
      "Upstash REST-style:",
      "  - UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN",
      "",
      "Also supported (legacy):",
      "  - VERCEL_KV_REST_API_URL + VERCEL_KV_REST_API_TOKEN",
      "",
      "If you connected a DB in Vercel Storage, it will auto-inject KV_REST_API_* vars.",
      "Make sure you redeploy after env var changes.",
    ].join("\n")
  );
}

function pickEnvPair() {
  // KV-style (what your screenshot shows)
  const KV_URL =
    process.env.KV_REST_API_URL ||
    process.env.KV_URL || // some integrations provide KV_URL
    process.env.VERCEL_KV_REST_API_URL ||
    "";

  const KV_TOKEN =
    process.env.KV_REST_API_TOKEN ||
    process.env.KV_REST_API_READ_ONLY_TOKEN || // allow read-only token as fallback
    process.env.VERCEL_KV_REST_API_TOKEN ||
    "";

  // Upstash REST-style (if you ever use it)
  const UP_URL = process.env.UPSTASH_REDIS_REST_URL || "";
  const UP_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || "";

  // Prefer KV-style if complete, else Upstash REST-style
  if (KV_URL && KV_TOKEN) return { url: KV_URL, token: KV_TOKEN, provider: "kv" as const };
  if (UP_URL && UP_TOKEN) return { url: UP_URL, token: UP_TOKEN, provider: "upstash" as const };

  return { url: "", token: "", provider: "none" as const };
}

export function kvNowISO() {
  return new Date().toISOString();
}

async function rest<T>(command: string, ...args: any[]): Promise<T> {
  const { url, token } = pickEnvPair();
  if (!url || !token) throw requiredEnvError();

  const res = await fetch(`${url}/${command}`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(args),
    cache: "no-store",
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    const msg =
      json?.error ||
      json?.message ||
      `KV request failed: ${command} (${res.status})`;
    throw new Error(msg);
  }

  // Upstash/Vercel KV REST returns { result: ... }
  return (json?.result ?? json) as T;
}

export const kv = {
  // Allowed: get, set, zadd, zrange, lpush, rpop
  async get(key: string) {
    return rest<any>("get", key);
  },

  async set(key: string, value: any) {
    return rest<any>("set", key, value);
  },

  async zadd(key: string, arg: ZAddArg) {
    if (Array.isArray(arg)) {
      const flat: any[] = [];
      for (const item of arg) flat.push(item.score, item.member);
      return rest<any>("zadd", key, ...flat);
    }
    return rest<any>("zadd", key, arg.score, arg.member);
  },

  async zrange(key: string, start: number, stop: number) {
    return rest<any>("zrange", key, start, stop);
  },

  async lpush(key: string, value: any) {
    return rest<any>("lpush", key, value);
  },

  async rpop(key: string) {
    return rest<any>("rpop", key);
  },
};

export async function kvJsonGet<T = JsonValue>(key: string): Promise<T | null> {
  const raw = await kv.get(key);
  if (raw == null) return null;

  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as T;
    } catch {
      return raw as any as T;
    }
  }

  return raw as T;
}

export async function kvJsonSet(key: string, value: JsonValue) {
  return kv.set(key, JSON.stringify(value));
}
