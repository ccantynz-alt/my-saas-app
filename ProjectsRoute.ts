// ProjectsRoute.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "crypto";
import { getCurrentUserId } from "./lib/demoAuth";
import { kvJsonGet, kvJsonSet, kvNowISO } from "./lib/kv";

type Project = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

function uid(prefix = "") {
  const id = randomUUID().replace(/-/g, "");
  return prefix ? `${prefix}_${id}` : id;
}

function indexKey(userId: string) {
  return `projects:index:${userId}`;
}

function projectKey(userId: string, projectId: string) {
  return `projects:${userId}:${projectId}`;
}

const CreateProjectSchema = z.object({
  name: z.string().min(1).max(120),
});

export async function getProjects() {
  const userId = getCurrentUserId();
  const ids = (await kvJsonGet<string[]>(indexKey(userId))) || [];
  const projects: Project[] = [];

  for (const id of ids) {
    const p = await kvJsonGet<Project>(projectKey(userId, id));
    if (p) projects.push(p);
  }

  projects.sort((a, b) => {
    const ta = Date.parse(a.updatedAt || a.createdAt) || 0;
    const tb = Date.parse(b.updatedAt || b.createdAt) || 0;
    return tb - ta;
  });

  return projects.map((p) => ({
    ...p,
    projectId: p.id, // normalized for UI
  }));
}

export async function getProject(projectId: string) {
  const userId = getCurrentUserId();
  const p = await kvJsonGet<Project>(projectKey(userId, projectId));
  if (!p) return null;
  return { ...p, projectId: p.id };
}

export async function createProject(name: string) {
  const userId = getCurrentUserId();
  const parsed = CreateProjectSchema.safeParse({ name });
  if (!parsed.success) {
    throw new Error("Invalid project name");
  }

  const createdAt = kvNowISO();
  const updatedAt = createdAt;
  const id = uid("proj");

  const project: Project = {
    id,
    name: parsed.data.name.trim(),
    createdAt,
    updatedAt,
  };

  await kvJsonSet(projectKey(userId, id), project);

  const idx = (await kvJsonGet<string[]>(indexKey(userId))) || [];
  const next = [id, ...idx.filter((x) => x !== id)];
  await kvJsonSet(indexKey(userId), next);

  return { ...project, projectId: id };
}
