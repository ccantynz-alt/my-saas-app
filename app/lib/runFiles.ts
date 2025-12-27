import { kvJsonGet } from "./kv";

export type RunFile = { path: string; content: string };

export function runFilesKey(userId: string, runId: string) {
  // IMPORTANT: If your existing implementation used a different key,
  // change this string to match your storage key.
  return `runs:${userId}:${runId}:files`;
}

export async function readRunFiles(userId: string, runId: string): Promise<RunFile[]> {
  const files = await kvJsonGet<RunFile[]>(runFilesKey(userId, runId));
  return Array.isArray(files) ? files : [];
}
