import { kv } from "@vercel/kv";
import { randomUUID } from "crypto";

/* =========================
   Types
========================= */

export type Project = {
  id: string;
  name: string;
  createdAt: string;
};

/* =========================
   Keys
========================= */

const PROJECT_INDEX_KEY = "projects:index";

function projectKey(id: string) {
  return `project:${id}`;
}

/* =========================
   Reads
========================= */

export async function listProjects(): Promise<Project[]> {
  const ids = (await kv.smembers(PROJECT_INDEX_KEY)) as string[];
  if (!ids || ids.length === 0) return [];

  const projects = await Promise.all(
    ids.map(async (id) => {
      const raw = await kv.get(projectKey(id));
      if (!raw) return null;
      return JSON.parse(raw as string) as Project;
    })
  );

  return projects.filter(Boolean) as Project[];
}

export async function getProject(id: string): Promise<Project | null> {
  const raw = await kv.get(projectKey(id));
  if (!raw) return null;
  return JSON.parse(raw as string) as Project;
}

/* =========================
   Writes
========================= */

export async function createProject(name: string): Promise<Project> {
  const id = randomUUID();

  const project: Project = {
    id,
    name,
    createdAt: new Date().toISOString(),
  };

  await kv.set(projectKey(id), JSON.stringify(project));
  await kv.sadd(PROJECT_INDEX_KEY, id);

  return project;
}
