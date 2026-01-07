import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import crypto from "crypto";

export const runtime = "nodejs";

const INDEX_V2 = "projects:index:v2";

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

export async function GET() {
  try {
    const raw = await kv.get(INDEX_V2);
    const projectIds = asStringArray(raw);

    const projects = await Promise.all(
      projectIds.map(async (id) => {
        const p = await kv.hgetall<any>(`project:${id}`);
        if (!p || Object.keys(p).length === 0) return null;
        return p;
      })
    );

    return NextResponse.json({
      ok: true,
      indexKey: INDEX_V2,
      projects: projects.filter(Boolean),
    });
  } catch (err: any) {
    console.error("LIST PROJECTS ERROR:", err?.message || err, err?.stack);
    return NextResponse.json(
      { ok: false, error: "Failed to list projects", details: err?.message || String(err) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const name = typeof body?.name === "string" ? body.name.trim() : "";

    const projectId = `proj_${crypto.randomBytes(12).toString("hex")}`;
    const createdAt = new Date().toISOString();

    // Create project hash
    await kv.hset(`project:${projectId}`, {
      id: projectId,
      name: name || "",
      createdAt,
      published: "false",
      domain: "",
      domainVerified: "false",
    });

    // Add to V2 index (JSON array)
    const raw = await kv.get(INDEX_V2);
    const current = asStringArray(raw);

    await kv.set(INDEX_V2, [projectId, ...current]);

    return NextResponse.json({
      ok: true,
      project: {
        id: projectId,
        name: name || "",
        createdAt,
        published: false,
      },
    });
  } catch (err: any) {
    console.error("CREATE PROJECT ERROR:", err?.message || err, err?.stack);
    return NextResponse.json(
      { ok: false, error: "Failed to create project", details: err?.message || String(err) },
      { status: 500 }
    );
  }
}
