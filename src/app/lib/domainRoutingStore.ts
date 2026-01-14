// src/app/lib/domainRoutingStore.ts

import { kv } from "@vercel/kv";

function normalizeHost(host: string): string {
  const h = (host || "").trim().toLowerCase();

  // remove port (example.com:3000)
  const noPort = h.split(":")[0];

  // remove trailing dot
  return noPort.replace(/\.$/, "");
}

const domainKey = (host: string) => `domain:${normalizeHost(host)}:projectId`;

/**
 * Map a verified host -> projectId
 * We store both apex and www (example.com + www.example.com)
 */
export async function setDomainProjectMapping(domainApex: string, projectId: string) {
  const apex = normalizeHost(domainApex);
  if (!apex) throw new Error("Invalid domain");

  await kv.set(domainKey(apex), projectId);
  await kv.set(domainKey(`www.${apex}`), projectId);
}

export async function getProjectIdForHost(host: string): Promise<string | null> {
  const h = normalizeHost(host);
  if (!h) return null;

  const val = await kv.get<string>(domainKey(h));
  return typeof val === "string" && val.length > 0 ? val : null;
}

export async function clearDomainProjectMapping(domainApex: string) {
  const apex = normalizeHost(domainApex);
  if (!apex) return;

  await kv.del(domainKey(apex));
  await kv.del(domainKey(`www.${apex}`));
}

export function normalizeIncomingHost(host: string): string {
  return normalizeHost(host);
}
