import { kv } from "./kv";

const KEY_PREFIX = "domain:route:";
const CLAIM_PREFIX = "domain:claim:";

export function normalizeDomain(input: string) {
  const host = (input || "").trim().toLowerCase();
  if (!host) return "";
  return host.split(":")[0];
}

function routeKey(domain: string) {
  return `${KEY_PREFIX}${normalizeDomain(domain)}`;
}

function claimKey(domain: string) {
  return `${CLAIM_PREFIX}${normalizeDomain(domain)}`;
}

/**
 * Get mapped projectId for a domain (apex only; middleware canonicalizes www -> apex).
 */
export async function getDomainProjectMapping(domain: string): Promise<string | null> {
  const d = normalizeDomain(domain);
  if (!d) return null;

  const value = await kv.get<string>(routeKey(d));
  return value || null;
}

/**
 * Set mapped projectId for a domain.
 */
export async function setDomainProjectMapping(domain: string, projectId: string): Promise<void> {
  const d = normalizeDomain(domain);
  if (!d) throw new Error("Missing domain");
  if (!projectId) throw new Error("Missing projectId");
  await kv.set(routeKey(d), projectId);
}

/**
 * Remove mapping for a domain.
 */
export async function deleteDomainProjectMapping(domain: string): Promise<void> {
  const d = normalizeDomain(domain);
  if (!d) return;
  await kv.del(routeKey(d));
}

/**
 * Compatibility export expected by /api/domains/resolve:
 * getProjectIdForHost(host) -> projectId|null
 */
export async function getProjectIdForHost(host: string): Promise<string | null> {
  const d = normalizeDomain(host);
  if (!d) return null;

  // support www host callers too (middleware canonicalizes, but API might not)
  const apex = d.startsWith("www.") ? d.slice(4) : d;

  return await getDomainProjectMapping(apex);
}

/**
 * Claim a domain so only one project can own it.
 * This is a simple KV "claim" record: domain -> projectId
 *
 * If the domain is already claimed by another project, throw.
 * If claimed by the same project, allow.
 */
export async function claimDomain(domain: string, projectId: string): Promise<void> {
  const d = normalizeDomain(domain);
  if (!d) throw new Error("Missing domain");
  if (!projectId) throw new Error("Missing projectId");

  const existing = await kv.get<string>(claimKey(d));
  if (existing && existing !== projectId) {
    throw new Error(`Domain already claimed by another project`);
  }

  await kv.set(claimKey(d), projectId);
}

/**
 * Release a claimed domain (only if it belongs to this project).
 */
export async function releaseDomain(domain: string, projectId: string): Promise<void> {
  const d = normalizeDomain(domain);
  if (!d) return;
  if (!projectId) return;

  const existing = await kv.get<string>(claimKey(d));
  if (!existing) return;

  if (existing === projectId) {
    await kv.del(claimKey(d));
  }
}
