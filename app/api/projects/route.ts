import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export const runtime = "nodejs";

const INDEX_V2 = "projects:index:v2";
// Legacy key is unreliable; do not read it (unknown Redis type)
const LEGACY_INDEX = "projects:index";

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
    // ✅ Read only the V2 index (stable JSON array)
    const raw = await kv.get(INDEX_V2);
    const projectIds = asStringArray(raw);

    // Load project hashes
    const projects = await Promise.all(
      projectIds.map(async (id) => {
        const p = await kv.hgetall(`project:${id}`);
        // If hash missing or empty, skip
        if (!p || Object.keys(p).length === 0) return null;
        return p;
      })
    );

    return NextResponse.json({
      ok: true,
      indexKey: INDEX_V2,
      legacyIndexKey: LEGACY_INDEX,
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
