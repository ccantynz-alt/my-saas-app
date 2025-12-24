import { kv } from "@vercel/kv";

/**
 * A thin wrapper around Vercel KV so we have
 * a single place to adjust behavior later
 */
export const KV = {
  async get<T = unknown>(key: string): Promise<T | null> {
    return (await kv.get(key)) as T | null;
  },

  async set(key: string, value: unknown) {
    await kv.set(key, value);
  },

  async del(key: string) {
    await kv.del(key);
  },

  async sadd(key: string, value: string) {
    await kv.sadd(key, value);
  },

  async smembers(key: string): Promise<string[]> {
    return (await kv.smembers(key)) as string[];
  },

  async zadd(
    key: string,
    entry: { score: number; member: string }
  ) {
    await kv.zadd(key, entry);
  },

  async zrange(
    key: string,
    start: number,
    stop: number,
    opts?: { rev?: boolean }
  ): Promise<string[]> {
    return (await kv.zrange(key, start, stop, opts)) as string[];
  },

  async rpush(key: string, value: unknown) {
    await kv.rpush(key, value);
  },

  async lrange<T = unknown>(
    key: string,
    start: number,
    stop: number
  ): Promise<T[]> {
    return (await kv.lrange(key, start, stop)) as T[];
  },
};
