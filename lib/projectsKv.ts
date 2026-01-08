import { kv } from "@vercel/kv";

export type ProjectRow = {
  projectId: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  publishedUrl?: string;
};

function keyProject(projectId: string) {
  return `project:${projectId}`;
}

const KEY_INDEX = "projects:index";

export async function createProjectKv(projectId: string, name: string) {
  const now = Date.now();
  const row: ProjectRow = {
    projectId,
    name: name || "Untitled site",
    createdAt: now,
    updatedAt: now,
  };

  await kv.set(keyProject(projectId), row);
  await kv.zadd(KEY_INDEX, { score: now, member: projectId });

  return row;
}

export async function setProjectNameKv(projectId: string, name: string) {
  const existing = (await kv.get<ProjectRow>(keyProject(projectId))) || null;
  const now = Date.now();

  const row: ProjectRow = {
    projectId,
    name: name || existing?.name || "Untitled site",
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    publishedUrl: existing?.publishedUrl,
  };

  await kv.set(keyProject(projectId), row);
  return row;
}

export async function setProjectPublishedKv(projectId: string, publishedUrl: string) {
  const existing = (await kv.get<ProjectRow>(keyProject(projectId))) || null;
  const now = Date.now();

  const row: ProjectRow = {
    projectId,
    name: existing?.name || "Untitled site",
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    publishedUrl,
  };

  await kv.set(keyProject(projectId), row);
  return row;
}

export async function listProjectsKv(limit = 50): Promise<ProjectRow[]> {
  const ids = (await kv.zrevrange(KEY_INDEX, 0, limit - 1)) as string[];
  if (!ids?.length) return [];

  const rows = await Promise.all(ids.map((id) => kv.get<ProjectRow>(keyProject(id))));
  return rows.filter(Boolean) as ProjectRow[];
}

export async function getProjectKv(projectId: string): Promise<ProjectRow | null> {
  return (await kv.get<ProjectRow>(keyProject(projectId))) || null;
}
