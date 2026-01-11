import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { kv } from "@vercel/kv";

export const runtime = "nodejs";

function devUserId(req?: Request) {
  if (process.env.NODE_ENV !== "production") {
    const h = req?.headers?.get("x-dev-user");
    if (h && h.trim()) return h.trim();
  }
  return null;
}

function isKvConfigured() {
  // Common env vars for Vercel KV
  const env = process.env as any;
  return Boolean(
    env.KV_REST_API_URL ||
      env.VERCEL_KV_REST_API_URL ||
      env.KV_URL ||
      env.VERCEL_KV_URL
  );
}

// ----------------------------
// DEV in-memory store (local only)
// ----------------------------
function devStore() {
  const g = globalThis as any;
  g.__devProjects = g.__devProjects ?? new Map<string, any>();
  g.__devIndex = g.__devIndex ?? new Map<string, string[]>();
  g.__devCounts = g.__devCounts ?? new Map<string, number>();
  return {
    projects: g.__devProjects as Map<string, any>,
    index: g.__devIndex as Map<string, string[]>,
    counts: g.__devCounts as Map<string, number>,
  };
}

function projectKey(projectId: string) {
  return "project:" + projectId;
}

function projectsIndexKey(clerkUserId: string) {
  return "projects:index:" + clerkUserId;
}

function projectCountKey(clerkUserId: string) {
  return "projects:count:" + clerkUserId;
}

function newProjectId() {
  return "proj_" + crypto.randomUUID().replace(/-/g, "");
}

async function kv_lpush(key: string, value: string) {
  if (isKvConfigured()) return kv.lpush(key, value);
  const ds = devStore();
  const arr = ds.index.get(key) ?? [];
  arr.unshift(value);
  ds.index.set(key, arr);
}

async function kv_lrange(key: string, start: number, stop: number) {
  if (isKvConfigured()) return (await kv.lrange(key, start, stop)) as any;
  const ds = devStore();
  const arr = ds.index.get(key) ?? [];
  // mimic Redis LRANGE end inclusive
  const end = stop < 0 ? arr.length : stop + 1;
  return arr.slice(start, end);
}

async function kv_hset(key: string, obj: any) {
  if (isKvConfigured()) return kv.hset(key, obj);
  const ds = devStore();
  ds.projects.set(key, obj);
}

async function kv_hgetall(key: string) {
  if (isKvConfigured()) return (await kv.hgetall(key)) as any;
  const ds = devStore();
  return ds.projects.get(key) ?? null;
}

async function kv_incr(key: string) {
  if (isKvConfigured()) return kv.incr(key);
  const ds = devStore();
  const cur = ds.counts.get(key) ?? 0;
  const next = cur + 1;
  ds.counts.set(key, next);
  return next;
}

export async function GET(req: Request) {
  try {
    const a = await auth();
    const userId = a.userId ?? devUserId(req);
    if (!userId) {
      return NextResponse.json({ ok: false, error: "Unauthenticated" }, { status: 401 });
    }

    const idxKey = projectsIndexKey(userId);
    const ids = (await kv_lrange(idxKey, 0, -1)) as string[];

    const projects: Array<{ id: string; name?: string; createdAt?: string }> = [];
    for (const id of ids) {
      const data = await kv_hgetall(projectKey(id));
      if (data && data.id) {
        projects.push({ id: data.id, name: data.name, createdAt: data.createdAt });
      }
    }

    return NextResponse.json({
      ok: true,
      projects,
      storage: isKvConfigured() ? "kv" : "dev-memory",
    });
  } catch (e: any) {
    console.error("GET /api/projects crashed:", e);
    return NextResponse.json(
      {
        ok: false,
        error: "Server error",
        message: String(e?.message ?? e),
        storage: isKvConfigured() ? "kv" : "dev-memory",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const a = await auth();
    const userId = a.userId ?? devUserId(req);
    if (!userId) {
      return NextResponse.json({ ok: false, error: "Unauthenticated" }, { status: 401 });
    }

    let body: any = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const projectId = newProjectId();
    const now = new Date().toISOString();

    const name =
      typeof body?.name === "string" && body.name.trim()
        ? body.name.trim()
        : "Untitled Project";

    const project = {
      id: projectId,
      clerkUserId: userId,
      name,
      createdAt: now,
      updatedAt: now,
      status: "draft",
    };

    await kv_hset(projectKey(projectId), project);
    await kv_lpush(projectsIndexKey(userId), projectId);
    await kv_incr(projectCountKey(userId));

    return NextResponse.json({
      ok: true,
      project,
      storage: isKvConfigured() ? "kv" : "dev-memory",
    });
  } catch (e: any) {
    console.error("POST /api/projects crashed:", e);
    return NextResponse.json(
      {
        ok: false,
        error: "Server error",
        message: String(e?.message ?? e),
        storage: isKvConfigured() ? "kv" : "dev-memory",
      },
      { status: 500 }
    );
  }
}