import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { kv } from "@vercel/kv";

export const dynamic = "force-dynamic";

/**
 * We store project IDs for a user in ONE of these indexes:
 * - user:<userId>:projects (SET)
 * - projects:user:<userId> (SET)
 * This route tries both, so it works even if older code used a different key.
 */
async function getUserProjectIds(userId: string): Promise<string[]> {
  const keyA = `user:${userId}:projects`;
  const keyB = `projects:user:${userId}`;

  // Try SET membership first
  try {
    const idsA = (await kv.smembers(keyA)) as string[] | null;
    if (idsA && idsA.length) return idsA;
  } catch {}

  try {
    const idsB = (await kv.smembers(keyB)) as string[] | null;
    if (idsB && idsB.length) return idsB;
  } catch {}

  // Fallback: nothing indexed yet
  return [];
}

/**
 * Ensure the project index key is a SET.
 * If it exists as the wrong type (string/hash/list/etc), delete it and recreate as a SET.
 */
async function ensureSetKey(key: string) {
  try {
    const t = await kv.type(key); // "none" | "string" | "list" | "set" | "zset" | "hash" | ...
    if (t !== "none" && t !== "set") {
      await kv.del(key);
    }
  } catch {
    // If kv.type isn't supported for some reason, we still handle WRONGTYPE in the caller.
  }
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized", projects: [] },
        { status: 401 }
      );
    }

    const projectIds = await getUserProjectIds(userId);

    // Load projects (best effort)
    const projects: any[] = [];
    for (const projectId of projectIds) {
      const p = await kv.hgetall<any>(`project:${projectId}`);
      if (p) {
        projects.push({
          id: projectId,
          ...p,
        });
      }
    }

    // Always return JSON, even if empty
    return NextResponse.json({ ok: true, projects });
  } catch (err: any) {
    // Always return JSON on error (NEVER return empty body)
    return NextResponse.json(
      {
        ok: false,
        error: err?.message || "Failed to load projects",
        projects: [],
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const name =
      typeof body?.name === "string" && body.name.trim()
        ? body.name.trim()
        : "Untitled Project";

    const projectId = `proj_${crypto.randomUUID().replace(/-/g, "")}`;
    const now = new Date().toISOString();

    await kv.hset(`project:${projectId}`, {
      id: projectId,
      userId,
      name,
      createdAt: now,
      updatedAt: now,
      publishedStatus: "",
      domain: "",
      domainStatus: "",
    });

    // Index keys
    const keyA = `user:${userId}:projects`;
    const keyB = `projects:user:${userId}`;

    // Make sure they are SETs (delete if wrong type)
    await ensureSetKey(keyA);
    await ensureSetKey(keyB);

    // Add to both indexes
    try {
      await kv.sadd(keyA, projectId);
    } catch (e: any) {
      // If it was still wrong type, delete and retry once
      await kv.del(keyA);
      await kv.sadd(keyA, projectId);
    }

    try {
      await kv.sadd(keyB, projectId);
    } catch (e: any) {
      await kv.del(keyB);
      await kv.sadd(keyB, projectId);
    }

    return NextResponse.json({ ok: true, projectId });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Failed to create project" },
      { status: 500 }
    );
  }
}
