// app/lib/store.ts
import "server-only";
import { kv, kvJsonGet, kvJsonSet, kvNowISO } from "@/app/lib/kv";

// -----------------------------
// Types
// -----------------------------
export type Project = {
  id: string;
  name: string;
  createdAt?: string;
};

export type Run = {
  id: string;
  projectId: string;
  status: string;
  createdAt?: string;
  prompt?: string;
};

// -----------------------------
// Keys
// -----------------------------
function indexKeyProjects(userId: string) {
  // ✅ SET of project IDs
  return `projects:index:${userId}`;
}

function projectKey(userId: string, projectId: string) {
  return `projects:${userId}:${projectId}`;
}

function runsIndexKey(userId: string, projectId: string) {
  // ✅ SET of run IDs per project (optional, but keeps things consistent)
  return `runs:index:${userId}:${projectId}`;
}

function runKey(userId: string, runId: string) {
  return `runs:${userId}:${runId}`;
}

// -----------------------------
// Projects
// -----------------------------
export async function createProject(userId: string, name: string): Promise<Project> {
  const projectId = `proj_${cryptoRandomId()}`;
  const project: Project = {
    id: projectId,
    name,
    createdAt: kvNowISO(),
  };

  await kvJsonSet(projectKey(userId, projectId), project);

  // ✅ SET index
  await kv.sadd(indexKeyProjects(userId), projectId);

  return project;
}

export async function getProject(userId: string, projectId: string): Promise<Project | null> {
  return kvJsonGet<Project>(projectKey(userId, projectId));
}

export async function listProjects(userId: string): Promise<Project[]> {
  // ✅ SET index (no zrange)
  const idsRaw = await kv.smembers(indexKeyProjects(userId)).catch(() => []);
  const ids: string[] = Array.isArray(idsRaw) ? idsRaw.map(String).filter(Boolean) : [];

  if (ids.length === 0) return [];

  const projects: Project[] = [];
  for (const id of ids) {
    const p = await kvJsonGet<Project>(projectKey(userId, id));
    if (p && p.id && p.name) projects.push(p);
  }

  // newest first
  projects.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));

  return projects;
}

// -----------------------------
// Runs (optional helpers)
// -----------------------------
export async function createRun(
  userId: string,
  projectId: string,
  input: { prompt?: string; status?: string } = {}
): Promise<Run> {
  const runId = `run_${cryptoRandomId()}`;
  const run: Run = {
    id: runId,
    projectId,
    status: input.status || "queued",
    prompt: input.prompt,
    createdAt: kvNowISO(),
  };

  await kvJsonSet(runKey(userId, runId), run);

  // ✅ SET index for runs per project
  await kv.sadd(runsIndexKey(userId, projectId), runId);

  return run;
}

export async function getRun(userId: string, runId: string): Promise<Run | null> {
  return kvJsonGet<Run>(runKey(userId, runId));
}

export async function listRuns(userId: string, projectId: string): Promise<Run[]> {
  const idsRaw = await kv.smembers(runsIndexKey(userId, projectId)).catch(() => []);
  const ids: string[] = Array.isArray(idsRaw) ? idsRaw.map(String).filter(Boolean) : [];

  if (ids.length === 0) return [];

  const runs: Run[] = [];
  for (const id of ids) {
    const r = await kvJsonGet<Run>(runKey(userId, id));
    if (r && r.id) runs.push(r);
  }

  runs.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));

  return runs;
}

// -----------------------------
// Helpers
// -----------------------------
function cryptoRandomId(): string {
  // No Node crypto import needed; this runs server-side on Node where crypto.randomUUID exists.
  // But to be extra safe across runtimes:
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return (crypto as any).randomUUID().replace(/-/g, "");
  }
  // Fallback
  return Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2);
}
