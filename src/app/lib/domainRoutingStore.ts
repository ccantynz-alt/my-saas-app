// src/app/lib/domainRoutingStore.ts

import { kv } from "@vercel/kv";

function normalizeHost(host: string): string {
  const h = (host || "").trim().toLowerCase();
  const noPort = h.split(":")[0];
  return noPort.replace(/\.$/, "");
}

export function normalizeIncomingHost(host: string): string {
  return normalizeHost(host);
}

const mappingKey = (host: string) => `domain:${normalizeHost(host)}:projectId`;

export async function getProjectIdForHost(host: string): Promise<string | null> {
  const h = normalizeHost(host);
  if (!h) return null;

  const val = await kv.get<string>(mappingKey(h));
  return typeof val === "string" && val.length > 0 ? val : null;
}

/**
 * Returns the projectId that owns the apex domain mapping (example.com).
 * This is how we prevent two projects claiming the same domain.
 */
export async function getDomainOwnerProjectId(domainApex: string): Promise<string | null> {
  const apex = normalizeHost(domainApex);
  if (!apex) return null;
  return await getProjectIdForHost(apex);
}

/**
 * Claim a domain for a project.
 * - If unclaimed -> claim succeeds
 * - If already claimed by same project -> ok (idempotent)
 * - If claimed by other project -> throw error
 *
 * Also writes www mapping.
 */
export async function claimDomain(domainApex: string, projectId: string) {
  const apex = normalizeHost(domainApex);
  if (!apex) throw new Error("Invalid domain");

  const existingOwner = await kv.get<string>(mappingKey(apex));
  if (existingOwner && existingOwner !== projectId) {
    throw new Error("This domain is already connected to another project.");
  }

  await kv.set(mappingKey(apex), projectId);
  await kv.set(mappingKey(`www.${apex}`), projectId);
}

/**
 * Release a domain mapping (only if caller is owner).
 * Also removes www mapping.
 */
export async function releaseDomain(domainApex: string, projectId: string) {
  const apex = normalizeHost(domainApex);
  if (!apex) return;

  const owner = await kv.get<string>(mappingKey(apex));
  if (owner && owner !== projectId) {
    throw new Error("Cannot remove mapping: domain belongs to another project.");
  }

  await kv.del(mappingKey(apex));
  await kv.del(mappingKey(`www.${apex}`));
}

/**
 * Internal/admin-only helper (use carefully)
 */
export async function setDomainProjectMappingUnsafe(domainApex: string, projectId: string) {
  const apex = normalizeHost(domainApex);
  if (!apex) throw new Error("Invalid domain");
  await kv.set(mappingKey(apex), projectId);
  await kv.set(mappingKey(`www.${apex}`), projectId);
}
