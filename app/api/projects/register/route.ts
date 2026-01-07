import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

// IMPORTANT: force Node runtime (Edge can cause KV issues)
export const runtime = "nodejs";

function asStringArray(value: unknown): string[] {
  // handles: undefined, array, json-string, single string
  if (!value) return [];
  if (Array.isArray(value)) return value.filter((x) => typeof x === "string") as string[];

  if (typeof value === "string") {
    // might be JSON string like '["proj_..."]' or just 'proj_...'
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.filter((x) => typeof x === "string") as string[];
      }
      // single string stored
      return [value];
    } catch {
      // not JSON, just a string
      return [value];
    }
  }

  // unknown object type -> ignore safely
  return [];
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const projectId = (body?.projectId || "").trim();

    if (!projectId || !projectId.startsWith("proj_")) {
      return NextResponse.json(
        { ok: false, error: "Invalid projectId" },
        { status: 400 }
      );
    }

    const projectKey = `project:${projectId}`;

    // If project hash doesn't exist yet, create a minimal shell record
    const exists = await kv.exists(projectKey);
    if (!exists) {
      await kv.hset(projectKey, {
        id: projectId,
        createdAt: new Date().toISOString(),
        recovered: "true",
      });
    }

    // Update index (safe even if stored as JSON string or array)
    const indexKey = "projects:index";
    const raw = await kv.get(indexKey);
    const current = asStringArray(raw);

    if (!current.includes(projectId)) {
      const next = [projectId, ...current];
      await kv.set(indexKey, next);
    }

    return NextResponse.json({ ok: true, projectId });
  } catch (err: any) {
    // Log the actual root cause to Vercel logs
    console.error("REGISTER PROJECT ERROR:", err?.message || err, err?.stack);

    // Return the real error message (helps debugging)
    return NextResponse.json(
      { ok: false, error: "Register failed", details: err?.message || String(err) },
      { status: 500 }
    );
  }
}
