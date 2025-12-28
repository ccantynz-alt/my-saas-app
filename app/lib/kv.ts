// app/lib/kv.ts
/**
 * Safe KV helpers for Vercel KV / Upstash Redis.
 *
 * Goals:
 * - NEVER crash on undefined (no .startsWith on undefined, etc.)
 * - Work with @vercel/kv when available
 * - Provide clear errors when env/deps are missing
 *
 * Exports used across your app:
 * - kv (proxy object with get/set/del)
 * - kvJsonGet / kvJsonSet (JSON helpers)
 * - kvNowISO (timestamp helper)
 */

type AnyObj = Record<string, any>;

let _client: any | null = null;
let _clientInitError: Error | null = null;

function str(x: unknown): string {
  return typeof x === "string" ? x : "";
}

function hasText(x: unknown): x is string {
  return typeof x === "string" && x.trim().length > 0;
}

function envSummary() {
  return {
    KV_REST_API_URL: !!process.env.KV_REST_API_URL,
    KV_REST_API_TOKEN: !!process.env.KV_REST_API_TOKEN,
    UPSTASH_REDIS_REST_URL: !!process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: !!process.env.UPSTASH_REDIS_REST_TOKEN,
    KV_REDIS_URL: !!process.env.KV_REDIS_URL,
    REDIS_URL: !!process.env.REDIS_URL,
    OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
  };
}

/**
 * We prefer @vercel/kv if installed.
 * It expects KV_REST_API_URL / KV_REST_API_TOKEN (or Upstash equivalents in some setups).
 * If user only has UPSTASH_* env vars, we map them into KV_* at runtime.
 */
async function getClient() {
  if (_client) return _client;
  if (_clientInitError) throw _clientInitError;

  try {
    // Map Upstash env vars to KV env vars if KV vars are missing.
    // This is safe and avoids fragile code elsewhere.
    if (!hasText(process.env.KV_REST_API_URL) && hasText(process.env.UPSTASH_REDIS_REST_URL)) {
      process.env.KV_REST_API_URL = str(process.env.UPSTASH_REDIS_REST_URL);
    }
    if (!hasText(process.env.KV_REST_API_TOKEN) && hasText(process.env.UPSTASH_REDIS_REST_TOKEN)) {
      process.env.KV_REST_API_TOKEN = str(process.env.UPSTASH_REDIS_REST_TOKEN);
    }

    // Try to load @vercel/kv dynamically (safe for Next build).
    const mod: any = await import("@vercel/kv");
    const candidate = mod?.kv;

    if (!candidate) {
      throw new Error(
        "Could not load @vercel/kv client (module loaded but kv export missing)."
      );
    }

    // Basic sanity check that it has the methods we need.
    if (typeof candidate.get !== "function" || typeof candidate.set !== "function") {
      throw new Error("Invalid kv client from @vercel/kv (missing get/set).");
    }

    _client = candidate;
    return _client;
  } catch (e: any) {
    const msg =
      "KV client init failed. Ensure you have @vercel/kv installed AND env vars set.\n" +
      "Expected env for Vercel KV/Upstash REST: KV_REST_API_URL + KV_REST_API_TOKEN (or UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN).\n" +
      "Env present: " +
      JSON.stringify(envSummary());

    _clientInitError = new Error(msg);
    (_clientInitError as any).cause = e;
    throw _clientInitError;
  }
}

/**
 * Exported kv proxy:
 * - keeps existing imports working: `import { kv } from "@/app/lib/kv"`
 * - delays client initialization until first usage
 */
export const kv: any = new Proxy(
  {},
  {
    get(_target, prop: string) {
      // Return an async function for any method call like kv.get/kv.set/kv.del/etc.
      return async (...args: any[]) => {
        const client = await getClient();
        const fn = client?.[prop];
        if (typeof fn !== "function") {
          throw new Error(`kv.${String(prop)} is not a function on the current KV client.`);
        }
        return fn.apply(client, args);
      };
    },
  }
);

export function kvNowISO() {
  return new Date().toISOString();
}

export async function kvJsonGet<T = any>(key: string): Promise<T | null> {
  const k = str(key);
  if (!hasText(k)) return null;

  const val = await kv.get(k);

  if (val == null) return null;

  // @vercel/kv can return objects directly (already parsed),
  // OR strings (stored JSON). Handle both safely.
  if (typeof val === "string") {
    try {
      return JSON.parse(val) as T;
    } catch {
      // Not JSON, return as-is if caller expects string-ish
      return val as unknown as T;
    }
  }

  return val as T;
}

export async function kvJsonSet(key: string, value: any) {
  const k = str(key);
  if (!hasText(k)) {
    throw new Error("kvJsonSet: key must be a non-empty string.");
  }

  // Store as JSON string (portable)
  const payload = JSON.stringify(value ?? null);
  return kv.set(k, payload);
}
