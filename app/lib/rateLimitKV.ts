import { kv } from "@/app/lib/kv";

type Bucket = {
  count: number;
  resetAt: number; // epoch ms
};

export async function rateLimitOrThrow(opts: {
  key: string;          // unique per user/project/action
  limit: number;        // max hits in window
  windowSec: number;    // window length
  message?: string;
}) {
  const now = Date.now();
  const bucket = (await kv.get(opts.key)) as Bucket | null;

  if (!bucket || now > bucket.resetAt) {
    const fresh: Bucket = { count: 1, resetAt: now + opts.windowSec * 1000 };
    await kv.set(opts.key, fresh);
    return { ok: true, remaining: opts.limit - 1, resetAt: fresh.resetAt };
  }

  if (bucket.count >= opts.limit) {
    const seconds = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
    throw new Error(
      opts.message || `Rate limit exceeded. Try again in ${seconds}s.`
    );
  }

  const next: Bucket = { ...bucket, count: bucket.count + 1 };
  await kv.set(opts.key, next);

  return { ok: true, remaining: Math.max(0, opts.limit - next.count), resetAt: next.resetAt };
}
