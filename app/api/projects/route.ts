import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(data: any, status = 200) {
  return NextResponse.json(data, { status });
}

function makeId(prefix: string) {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, "")}`;
}

async function readProjectAny(projectId: string) {
  const key = `project:${projectId}`;

  // Prefer hash
  try {
    const hash = await kv.hgetall<any>(key);
    if (hash && Object.keys(hash).length > 0) return hash;
  } catch {}

  // Fallback json/string
  try {
    const obj = await kv.get<any>(key);
    if (obj) return obj;
  } catch {}

  return null;
}

async function readIndexIds(limit = 300): Promise<string[]> {
  try {
    const ids = await kv.lrange<string>("projects:index", 0, limit - 1);
    return Array.isArray(ids) ? ids.filter(Boolean) : [];
  } catch {
    return [];
  }
}

function dedupePreserveOrder(ids: string[]) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const id of ids) {
    if (!seen.has(id)) {
      seen.add(id);
      out.push(id);
    }
  }
  return out;
}

export async function GET() {
  try {
    const idsRaw = await readIndexIds(500);
    const ids = dedupePreserveOrder(idsRaw);

    if (ids.length === 0) {
      return json({ ok: true, projects: [] });
    }

    const projects = await Promise.all(
      ids.map(async (id) => {
        const project = await readProjectAny(id);
        if (!project) return null;

        // compute hasHtml (latest key exists)
        const htmlKey = `generated:project:${id}:latest`;
        let hasHtml = false;
        try {
          const html = await kv.get<string>(htmlKey);
          hasHtml = typeof html === "string" && html.trim().length > 0;
        } catch {
          hasHtml = false;
        }

        return {
          id: project.id ?? id,
          name: project.name ?? "Untitled",
          createdAt: project.createdAt ?? null,

          published: project.published === true,
          domain: project.domain ?? null,
          domainStatus: project.domainStatus ?? null,

          hasHtml,
        };
      })
    );

    return json({ ok: true, projects: projects.filter(Boolean) });
  } catch (err) {
    console.error("GET /api/projects error:", err);
    return json({ ok: false, error: "Failed to load projects" }, 500);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const name =
      typeof body?.name === "string" && body.name.trim()
        ? body.name.trim()
        : "New project";

    const id = makeId("proj");

    const project = {
      id,
      name,
      createdAt: new Date().toISOString(),
      published: false,
      domain: null,
      domainStatus: null,
    };

    // Store as hash (preferred)
    await kv.hset(`project:${id}`, project as any);

    // Maintain index (newest first)
    try {
      await kv.lpush("projects:index", id);
    } catch {
      // ignore
    }

    return json({ ok: true, project });
  } catch (err) {
    console.error("POST /api/projects error:", err);
    return json({ ok: false, error: "Failed to create project" }, 500);
  }
}
