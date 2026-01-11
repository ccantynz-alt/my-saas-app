import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { kv } from "@vercel/kv";

export const runtime = "nodejs";

function isKvConfigured() {
  const env = process.env as any;
  return Boolean(env.KV_REST_API_URL || env.VERCEL_KV_REST_API_URL || env.KV_URL || env.VERCEL_KV_URL);
}

function devStore() {
  const g = globalThis as any;
  g.__devProjects = g.__devProjects ?? new Map<string, any>();
  g.__devPublished = g.__devPublished ?? new Set<string>();
  return {
    projects: g.__devProjects as Map<string, any>,
    published: g.__devPublished as Set<string>,
  };
}

function projectKey(projectId: string) {
  return "project:" + projectId;
}
function publishedKey(projectId: string) {
  return "published:project:" + projectId;
}

async function kv_hgetall(key: string) {
  if (isKvConfigured()) return (await kv.hgetall(key)) as any;
  const ds = devStore();
  return ds.projects.get(key) ?? null;
}
async function kv_hset(key: string, obj: any) {
  if (isKvConfigured()) return kv.hset(key, obj);
  const ds = devStore();
  ds.projects.set(key, obj);
}
async function kv_markPublished(key: string) {
  if (isKvConfigured()) {
    await kv.set(key, "true");
    return;
  }
  const ds = devStore();
  ds.published.add(key);
}

export async function POST(req: Request, ctx: { params: { projectId: string } }) {
  try {
    const a = await auth();
    const userId = a.userId;
    if (!userId) {
      return NextResponse.json({ ok: false, error: "Unauthenticated" }, { status: 401 });
    }

    const projectId = ctx?.params?.projectId;
    if (!projectId) {
      return NextResponse.json({ ok: false, error: "Missing projectId" }, { status: 400 });
    }

    const project = (await kv_hgetall(projectKey(projectId))) as any;
    if (!project || !project.id) {
      return NextResponse.json({ ok: false, error: "Project not found" }, { status: 404 });
    }

    if (project.clerkUserId && project.clerkUserId !== userId) {
      return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
    }

    await kv_markPublished(publishedKey(projectId));

    await kv_hset(projectKey(projectId), {
      ...project,
      updatedAt: new Date().toISOString(),
      status: "published",
    });

    return NextResponse.json({
      ok: true,
      projectId,
      published: true,
      storage: isKvConfigured() ? "kv" : "dev-memory",
    });
  } catch (e: any) {
    console.error("POST /publish crashed:", e);
    return NextResponse.json({ ok: false, error: "Server error", message: String(e?.message ?? e) }, { status: 500 });
  }
}