import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

// Force Node runtime (more reliable with KV)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * KV keys used:
 * - project:<id>                 -> project object
 * - projects:index               -> list of project ids (newest first)
 *
 * Optional fallback:
 * - If index is empty (older installs), we try kv.keys("project:*")
 *   and rebuild the index. If keys is blocked, we still return empty list.
 */

function json(data: any, status = 200) {
  return NextResponse.json(data, { status });
}

function makeId(prefix: string) {
  return `${prefix}_${crypto.randomUUID().replace(/-/g, "")}`;
}

async function safeReadIndexIds(): Promise<string[]> {
  try {
    const ids = await kv.lrange<string>("projects:index", 0, 200);
    return Array.isArray(ids) ? ids.filter(Boolean) : [];
  } catch {
    return [];
  }
}

async function safeRebuildIndexFromKeys(): Promise<string[]> {
  // Some KV providers block KEYS; this is best-effort only.
  try {
    const keys = await kv.keys("project:*");
    const ids = (keys || [])
      .map((k) => (typeof k === "string" ? k.replace("project:", "") : ""))
      .filter(Boolean);

    // Rebuild index newest-first by createdAt where possible
    const rows = await Promise.all(
      ids.map(async (id) => {
        const p = await kv.get<any>(`project:${id}`);
        return p ? { id, createdAt: p.createdAt ?? null } : null;
      })
    );

    const cleaned = rows.filter(Boolean) as { id: string; createdAt: string | null }[];

    cleaned.sort((a, b) => {
      const at = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bt = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bt - at;
    });

    const sortedIds = cleaned.map((r) => r.id);

    // Write back to index (best-effort)
    try {
      await kv.del("projects:index");
      if (sortedIds.length > 0) {
        // LPUSH expects values in order; we want newest first at index head.
        // If sortedIds is already newest-first, LPUSH in reverse so it ends up correct.
        await kv.lpush("projects:index", ...[...sortedIds].reverse());
      }
    } catch {
      // ignore
    }

    return sortedIds;
  } catch {
    return [];
  }
}

export async function GET() {
  try {
    // 1) Prefer index list
    let ids = await safeReadIndexIds();

    // 2) If empty, try to rebuild from keys (older installs)
    if (ids.length === 0) {
      ids = await safeRebuildIndexFromKeys();
    }

    if (ids.length === 0) {
      return json({ ok: true, projects: [] });
    }

    const projects = await Promise.all(
      ids.map(async (id) => {
        const project = await kv.get<any>(`project:${id}`);
        if (!project) return null;

        return {
          id: project.id ?? id,
          name: project.name ?? "Untitled",
          createdAt: project.createdAt ?? null,

          // For badges
          published: project.published === true,
          domain: project.domain ?? null,
          domainStatus: project.domainStatus ?? null,
        };
      })
    );

    const cleaned = projects.filter(Boolean) as any[];

    return json({ ok: true, projects: cleaned });
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

      // Defaults
      published: false,
      domain: null,
      domainStatus: null,
    };

    // Save project
    await kv.set(`project:${id}`, project);

    // Add to index (newest first)
    try {
      await kv.lpush("projects:index", id);
    } catch {
      // ignore index write failure (still created)
    }

    return json({ ok: true, project });
  } catch (err) {
    console.error("POST /api/projects error:", err);
    return json({ ok: false, error: "Failed to create project" }, 500);
  }
}
