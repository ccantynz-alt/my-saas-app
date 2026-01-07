import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export const runtime = "nodejs";

// 🔥 Change this string if you re-deploy again
const VERSION = "register-v3";

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

    const exists = await kv.exists(projectKey);
    if (!exists) {
      await kv.hset(projectKey, {
        id: projectId,
        createdAt: new Date().toISOString(),
        recovered: "true",
      });
    }

    const indexKey = "projects:index";
    const raw = await kv.get(indexKey);
    const current = asStringArray(raw);

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

