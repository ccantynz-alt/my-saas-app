import { kv, kvJsonGet, kvJsonSet, kvNowISO } from "./kv";
import { K } from "./keys";
import { uid } from "./id";
import type { Project, Run } from "./types";

export async function listProjects(): Promise<Project[]> {
  // newest first by score (ms)
  const ids = await kv.zrange<string[]>(K.projectsIndex, 0, 49, { rev: true });
  const projects: Project[] = [];
  for (const id of ids) {
    const p = await kvJsonGet<Project>(K.project(id));
    if (p) projects.push(p);
  }
  return projects;
}

export async function getProject(id: string): Promise<Project | null> {
  return kvJsonGet<Project>(K.project(id));
}

export async function createProject(input: {
  name: string;
  repoUrl: string;
  defaultBranch?: string;
  vercelDeployHookUrl?: string;
}): Promise<Project> {
  const id = uid("proj");
  const createdAt = await kvNowISO();
  const project: Project = {
    id,
    name: input.name,
    repoUrl: input.repoUrl,
    defaultBranch: input.defaultBranch,
    vercelDeployHookUrl: input.vercelDeployHookUrl,
    createdAt,
  };

  await kvJsonSet(K.project(id), project);
  await kv.zadd(K.projectsIndex, { score: Date.now(), member: id });
  return project;
}

export async function updateProject(id: string, patch: Partial<Project>): Promise<Project> {
  const existing = await getProject(id);
  if (!existing) throw new Error("Project not found");
  const next = { ...existing, ...patch, id: existing.id, createdAt: existing.createdAt };
  await kvJsonSet(K.project(id), next);
  return next;
}

export async function deleteProject(id: string) {
  await kv.del(K.project(id));
  await kv.zrem(K.projectsIndex, id);
  // runs are left for now (you can GC later)
}

export async function listRuns(projectId: string, limit = 20): Promise<Run[]> {
  const ids = await kv.zrange<string[]>(K.runsIndex(projectId), 0, limit - 1, { rev: true });
  const runs: Run[] = [];
  for (const rid of ids) {
    const r = await kvJsonGet<Run>(K.run(rid));
    if (r) runs.push(r);
  }
  return runs;
}

export async function getRun(runId: string): Promise<Run | null> {
  return kvJsonGet<Run>(K.run(runId));
}

export async function enqueueRun(projectId: string, trigger: Run["trigger"] = "manual"): Promise<Run> {
  const id = uid("run");
  const createdAt = await kvNowISO();
  const run: Run = {
    id,
    projectId,
    status: "queued",
    createdAt,
    trigger,
    logs: [`[${createdAt}] queued`],
  };

  await kvJsonSet(K.run(id), run);
  await kv.zadd(K.runsIndex(projectId), { score: Date.now(), member: id });
  await kv.lpush(K.queue, id); // left-push, and worker will rpop
  return run;
}

export async function appendRunLog(runId: string, line: string) {
  const run = await getRun(runId);
  if (!run) return;
  run.logs = [...(run.logs ?? []), line].slice(-500); // cap logs
  await kvJsonSet(K.run(runId), run);
}

export async function setRun(runId: string, patch: Partial<Run>) {
  const run = await getRun(runId);
  if (!run) return null;
  const next: Run = { ...run, ...patch, id: run.id, projectId: run.projectId, createdAt: run.createdAt };
  await kvJsonSet(K.run(runId), next);
  return next;
}
