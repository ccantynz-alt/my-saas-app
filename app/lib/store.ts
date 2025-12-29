// app/lib/store.ts
import "server-only";

import { kv, kvJsonGet, kvJsonSet, kvNowISO } from "./kv";
import { randomUUID } from "crypto";

// -----------------------------
// Types
// -----------------------------
export type Project = {
  id: string;
  projectId: string; // always equal to id
  name: string;
  createdAt: string;
};

export type Run = {
  id: string;
  runId: string; // always equal to id
  projectId: string;
  status: "queued" | "running" | "completed" | "failed";
  createdAt: string;
  prompt?: string;
  error?: string;
};

export type ProjectFile = {
  path: string;
  content: string;
  updatedAt: string;
};

// -----------------------------
// Helpers
// -----------------------------
function uid(prefix = ""): string {
  const id = randomUUID().replace(/-/g, "");
  return prefix ? `${prefix}_${id}` : id;
}

function nowIso() {
  return kvNowISO();
}

function indexKeyProjects(userId: string) {
  return `projects:index:${userId}`;
}

function keyProject(userId: string, projectId: string) {
  return `projects:${userId}:${projectId}`;
}

function indexKeyRuns(projectId: string) {
  return `runs:index:${projectId}`;
}

function keyRun(runId: string) {
  return `runs:${runId}`;
}

function keyRunLogs(runId: string) {
  return `runs:${runId}:logs`;
}

function keyProjectFiles(projectId: string) {
  return `projects:${projectId}:files`;
}

function normalizeProject(raw: any): Project {
  const id = String(raw?.projectId || raw?.id || "");
  return {
    id,
    projectId: id,
    name: String(raw?.name || "Untitled Project"),
    createdAt: String(raw?.createdAt || nowIso()),
  };
}

function normalizeRun(raw: any): Run {
  const id = String(raw?.runId || raw?.id || "");
  return {
    id,
    runId: id,
    projectId: String(raw?.projectId || ""),
    status: (raw?.status as Run["status"]) || "queued",
    createdAt: String(raw?.createdAt || nowIso()),
    prompt: raw?.prompt ? String(raw.prompt) : undefined,
    error: raw?.error ? String(raw.error) : undefined,
  };
}

// -----------------------------
// Projects
// -----------------------------
export async function listProjects(userId: string): Promise<Project[]> {
  const ids = (await kv.zrange(indexKeyProjects(userId), 0, -1)) as unknown as string[];
  if (!ids || ids.length === 0) return [];

  const projects = await Promise.all(
    ids.map(async (projectId) => {
      const raw = await kvJsonGet(keyProject(userId, projectId));
      if (!raw) return null;
      return normalizeProject(raw);
    })
  );

  return (projects.filter(Boolean) as Project[]).sort((a, b) =>
    a.createdAt < b.createdAt ? 1 : -1
  );
}

export async function getProject(userId: string, projectId: string): Promise<Project | null> {
  const raw = await kvJsonGet(keyProject(userId, projectId));
  if (!raw) return null;
  return normalizeProject(raw);
}

export async function createProject(
  userId: string,
  name: string = "Untitled Project"
): Promise<Project> {
  const projectId = uid("proj");
  const project: Project = {
    id: projectId,
    projectId,
    name: name.trim() || "Untitled Project",
    createdAt: nowIso(),
  };

  await kvJsonSet(keyProject(userId, projectId), project);
  await kv.zadd(indexKeyProjects(userId), { score: Date.now(), member: projectId });

  return project;
}

// -----------------------------
// Runs
// -----------------------------
export async function listRuns(projectId: string): Promise<Run[]> {
  const ids = (await kv.zrange(indexKeyRuns(projectId), 0, -1)) as unknown as string[];
  if (!ids || ids.length === 0) return [];

  const runs = await Promise.all(
    ids.map(async (runId) => {
      const raw = await kvJsonGet(keyRun(runId));
      if (!raw) return null;
      return normalizeRun(raw);
    })
  );

  return (runs.filter(Boolean) as Run[]).sort((a, b) =>
    a.createdAt < b.createdAt ? 1 : -1
  );
}

export async function getRun(runId: string): Promise<Run | null> {
  const raw = await kvJsonGet(keyRun(runId));
  if (!raw) return null;
  return normalizeRun(raw);
}

export async function createRun(projectId: string, prompt?: string): Promise<Run> {
  const runId = uid("run");
  const run: Run = {
    id: runId,
    runId,
    projectId,
    status: "queued",
    createdAt: nowIso(),
    prompt,
  };

  await kvJsonSet(keyRun(runId), run);
  await kv.zadd(indexKeyRuns(projectId), { score: Date.now(), member: runId });

  // initialize logs as empty array
  await kvJsonSet(keyRunLogs(runId), []);

  return run;
}

export async function setRunStatus(runId: string, status: Run["status"], error?: string) {
  const existing = await getRun(runId);
  if (!existing) return;

  const updated: Run = {
    ...existing,
    status,
    error: error ? String(error) : existing.error,
  };

  await kvJsonSet(keyRun(runId), updated);
}

// -----------------------------
// Run Logs (NO LIST OPS)
// Stored as JSON array using get/set only.
// -----------------------------
export async function appendRunLog(runId: string, line: string, limit = 300) {
  const entry = `${nowIso()} ${line}`;

  const key = keyRunLogs(runId);
  const logs = (await kvJsonGet<string[]>(key)) || [];

  logs.push(entry);

  // cap
  if (logs.length > limit) logs.splice(0, logs.length - limit);

  await kvJsonSet(key, logs);
}

export async function getRunLogs(runId: string, limit = 300): Promise<string[]> {
  const key = keyRunLogs(runId);
  const logs = (await kvJsonGet<string[]>(key)) || [];
  if (logs.length <= limit) return logs;
  return logs.slice(logs.length - limit);
}

export async function clearRunLogs(runId: string) {
  await kvJsonSet(keyRunLogs(runId), []);
}

// -----------------------------
// Project Files (stored as JSON array)
// -----------------------------
export async function getProjectFiles(projectId: string): Promise<ProjectFile[]> {
  const raw = await kvJsonGet<ProjectFile[]>(keyProjectFiles(projectId));
  return Array.isArray(raw) ? raw : [];
}

export async function setProjectFiles(projectId: string, files: ProjectFile[]) {
  const normalized = (files || []).map((f) => ({
    path: String(f.path || ""),
    content: String(f.content || ""),
    updatedAt: String(f.updatedAt || nowIso()),
  }));
  await kvJsonSet(keyProjectFiles(projectId), normalized);
}

export async function upsertProjectFile(projectId: string, path: string, content: string) {
  const files = await getProjectFiles(projectId);
  const idx = files.findIndex((f) => f.path === path);
  const file: ProjectFile = { path, content, updatedAt: nowIso() };

  if (idx >= 0) files[idx] = file;
  else files.push(file);

  await kvJsonSet(keyProjectFiles(projectId), files);
}
