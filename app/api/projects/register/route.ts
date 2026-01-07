import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export const runtime = "nodejs";
const VERSION = "register-v4";

function asStringArray(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter((x) => typeof x === "string") as string[];

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter((x) => typeof x === "string") as string[];
      }
      return [value];
    } catch {
      return [value];
    }
  }

  return [];
}

async function readProjectsIndex(indexKey: string): Promise<string[]> {
  // First try GET (works if key is JSON/string)
  try {
    const raw = await kv.get(indexKey);
    return asStringArray(raw);
  } catch (err: any) {
    const msg = String(err?.message || err);

    // If it’s WRONGTYPE, the key is likely a Redis LIST
    if (msg.includes("WRONGTYPE")) {
      // Read list contents
      const list = (await kv.lrange(indexKey, 0, 999)) as unknown;
      const arr = asStringArray(list);

      // ✅ MIGRATE: store as JSON array so future reads are stable
      // (Also keep the list as-is; we’re not deleting anything here)
      await kv.set(indexKey, arr);

      return arr;
    }

    throw err;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const projectId = String(body?.projectId || "").trim();

    if (!projectId.startsWith("proj_")) {
      return NextResponse.json(
        { ok: false, error: "Invalid projectId", version: VERSION },
        { status: 400 }
      );
    }

    const projectKey = `project:${projectId}`;

    // Create shell project if missing
    const exists = await kv.exists(projectKey);
    if (!exists) {
      await kv.hset(projectKey, {
        id: projectId,
        createdAt: new Date().toISOString(),
        recovered: "true",
      });
    }

    const indexKey = "projects:index";
    const current = await readProjectsIndex(indexKey);

    if (!current.includes(projectId)) {
      await kv.set(indexKey, [projectId, ...current]);
    }

    return NextResponse.json({ ok: true, projectId, version: VERSION });
  } catch (err: any) {
    console.error("REGISTER PROJECT ERROR:", err?.message || err, err?.stack);

    return NextResponse.json(
      {
        ok: false,
        error: "Register failed",
        details: err?.message || String(err),
        version: VERSION,
      },
      { status: 500 }
    );
  }
}
