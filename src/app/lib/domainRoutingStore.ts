import { kv } from "./kv";

const KEY_PREFIX = "domain:route:";

export function normalizeDomain(input: string) {
  // Lowercase, strip port, trim
  const host = (input || "").trim().toLowerCase();
  if (!host) return "";
  return host.split(":")[0];
}

function keyFor(domain: string) {
  return `${KEY_PREFIX}${normalizeDomain(domain)}`;
}

/**
 * Get mapped projectId for a domain (apex only; middleware canonicalizes www -> apex).
 */
export async function getDomainProjectMapping(domain: string): Promise<string | null> {
  const d = normalizeDomain(domain);
  if (!d) return null;

  const value = await kv.get<string>(keyFor(d));
  return value || null;
}

/**
 * Set mapped projectId for a domain.
 * This is the export your API route expects: setDomainProjectMapping(...)
 */
export async function setDomainProjectMapping(domain: string, projectId: string): Promise<void> {
  const d = normalizeDomain(domain);
  if (!d) throw new Error("Missing domain");
  if (!projectId) throw new Error("Missing projectId");

  await kv.set(keyFor(d), projectId);
}

/**
 * Remove mapping for a domain.
 */
export async function deleteDomainProjectMapping(domain: string): Promise<void> {
  const d = normalizeDomain(domain);
  if (!d) return;
  await kv.del(keyFor(d));
}
