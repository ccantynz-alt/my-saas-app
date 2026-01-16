// pages/api/projects/[projectId]/debug/spec.ts
import type { NextApiRequest, NextApiResponse } from "next";

// Prefer the same KV layer your app already uses.
// If you use @vercel/kv, this will work automatically.
// If your project has a custom kv helper, we attempt best-effort imports too.
async function getKvClient(): Promise<any> {
  try {
    const mod = await import("@vercel/kv");
    if ((mod as any).kv) return (mod as any).kv;
  } catch {}

  const candidates = [
    "../../../../../../src/app/lib/kv",
    "../../../../../../app/lib/kv",
    "../../../../../../src/lib/kv",
    "../../../../../../lib/kv",
  ];

  for (const p of candidates) {
    try {
      const mod = await import(p);
      if ((mod as any).kv) return (mod as any).kv;
      if ((mod as any).default) return (mod as any).default;
    } catch {}
  }

  throw new Error(
    "KV client not found. Ensure @vercel/kv is installed + env vars set, or export kv from a local helper."
  );
}

function safeJsonParse(s: string) {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

function clipString(s: string, max = 8000) {
  if (s.length <= max) return s;
  return s.slice(0, max) + `…(clipped, len=${s.length})`;
}

type Out = {
  ok: boolean;
  projectId: string;
  nowIso: string;
  found?: { key: string; type: string; bytes: number; preview: any };
  tried: Array<{ key: string; hit: boolean; type?: string; bytes?: number }>;
  note?: string;
  error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Out>) {
  const projectId = String(req.query.projectId || "").trim();
  const nowIso = new Date().toISOString();

  if (!projectId) {
    return res.status(400).json({
      ok: false,
      projectId: "",
      nowIso,
      tried: [],
      error: "Missing projectId",
    });
  }

  try {
    const kv: any = await getKvClient();

    const candidates = [
      `project:${projectId}:publishedSpec`,
      `project:${projectId}:spec`,
      `project:${projectId}:siteSpec`,
      `project:${projectId}:draftSpec`,
      `project:${projectId}:latestSpec`,
      `proj:${projectId}:publishedSpec`,
      `proj:${projectId}:spec`,
      `${projectId}:publishedSpec`,
      `${projectId}:spec`,
    ];

    const tried: Out["tried"] = [];

    const tryGet = async (key: string) => {
      try {
        const v = await kv.get(key);
        if (v == null) {
          tried.push({ key, hit: false });
          return null;
        }
        const raw = typeof v === "string" ? v : JSON.stringify(v);
        tried.push({ key, hit: true, type: typeof v, bytes: raw.length });

        if (typeof v === "string") {
          const parsed = safeJsonParse(v);
          return parsed ?? clipString(v, 2000);
        }
        return v;
      } catch {
        tried.push({ key, hit: false });
        return null;
      }
    };

    for (const key of candidates) {
      const v = await tryGet(key);
      if (v != null) {
        const bytes =
          typeof v === "string" ? v.length : JSON.stringify(v).length;

        return res.status(200).json({
          ok: true,
          projectId,
          nowIso,
          tried,
          found: {
            key,
            type: typeof v,
            bytes,
            preview: typeof v === "string" ? clipString(v, 3000) : v,
          },
        });
      }
    }

    return res.status(200).json({
      ok: true,
      projectId,
      nowIso,
      tried,
      note:
        "No spec found under candidate keys. Next step: update publish to write project:<id>:publishedSpec explicitly.",
    });
  } catch (e: any) {
    return res.status(500).json({
      ok: false,
      projectId,
      nowIso,
      tried: [],
      error: e?.message || String(e),
    });
  }
}
