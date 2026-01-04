/**
 * TEMP STUB:
 * Original file depended on '@/app/lib/kv' alias which does not exist.
 * Keep exports so imports won't break.
 */

export async function listSeoPages(_projectId: string) {
  return { ok: true, status: "stub", pages: [] as any[] };
}

export async function getSeoPage(_projectId: string, _slug: string) {
  return { ok: true, status: "stub", page: null as any };
}

export async function saveSeoPage(_projectId: string, _slug: string, _data: any) {
  return { ok: false, status: "not_implemented" };
}
