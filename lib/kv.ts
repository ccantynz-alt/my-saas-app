import "server-only";

/**
 * ROOT KV WRAPPER
 * This file exists ONLY to satisfy imports like:
 *   ../../../lib/kv
 * It re-exports everything from app/lib/kv
 */

export * from "../app/lib/kv";
