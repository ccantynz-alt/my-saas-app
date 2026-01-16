// pages/api/projects/[projectId]/debug/spec.ts
import type { NextApiRequest, NextApiResponse } from "next";

type Result = {
  ok: boolean;
  projectId: string;
  nowIso: string;
  found?: {
    key: string;
    type: string;
    bytes: number;
    preview: any;
  };
  tried?: Array<{ key: string; hit: boolean; type?: string; bytes?: number }>;
  keysLikeProjectId?: string[];
  note?: string;
  error?: string;
};

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

async function getKvClient(): Promise<any> {
  // Primary (most common in Vercel KV projects)
  try {
    const mod = await import("@vercel/kv");
    if ((mod as any).kv) return (mod as any).kv;
  } catch {}

  // If your repo uses a local kv helper (common in your project history), try a few safe paths.
  const candidates = [
    "../../../../../src/app/lib/kv",
    "../../../../../app/lib/kv",
    "../../../../../src/lib/kv",
    "../../../../../lib/kv",
  ];

  for (const p of candidates) {
    try {
      const mod = await import(p);
      if ((mod as any).kv) return (mod as any).kv;
      if ((mod as any).default) return (mod as any).default;
    } catch {}
  }

  throw new Error(
    "KV client not found. Install/use @vercel/kv or export kv from a local helper."
  );
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Result>) {
  const projectId = String(req.query.projectId || "").trim();
  const nowIso = new Date().toISOString();

  if (!projectId) {
    return res.status(400).json({
      ok: false,
      projectId: "",
      nowIso,
      error: "Missing projectId",
    });
  }

  try {
    const kv: any = await getKvClient();

    // Strategy A (best): scan for keys that contain the projectId (if scan exists).
    // Not all KV clients expose scan; we detect at runtime.
    let keysLikeProjectId: string[] = [];
    if (typeof kv.scan === "function") {
      // Try multiple patterns; keep counts low to avoid timeouts.
      const patterns = [`*${projectId}*`, `*:${projectId}:*`, `*${projectId}`];
      for (const match of patterns) {
        try {
          // Many clients use (cursor, { match, count }) or (cursor, match, count).
          // We support both shapes defensively.
          let cursor: any = "0";
          let loops = 0;
          while (loops < 3) {
            loops++;
            let out: any;

            try {
              out = await kv.scan(cursor, { match, count: 200 });
            } catch {
              out = await kv.scan(cursor, match, 200);
            }

            const nextCursor = Array.isArray(out) ? out[0] : out?.cursor ?? "0";
            const keys = Array.isArray(out) ? out[1] : out?.keys ?? [];
            if (Array.isArray(keys)) keysLikeProjectId.push(...keys);

            cursor = String(nextCursor ?? "0");
            if (cursor === "0") break;
          }
        } catch {}
      }

      // de-dupe
      keysLikeProjectId = Array.from(new Set(keysLikeProjectId)).slice(0, 200);
    }

    // Strategy B: try a short list of likely spec keys.
    // This does NOT assume which one is correct — it just checks and reports hits.
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

    const tried: Array<{ key: string; hit: boolean; type?: string; bytes?: number }> = [];

    const tryGet = async (key: string) => {
      try {
        const v = await kv.get(key);
        if (v == null) {
          tried.push({ key, hit: false });
          return null;
        }

        const raw =
          typeof v === "string" ? v : JSON.stringify(v);

        tried.push({
          key,
          hit: true,
          type: typeof v,
          bytes: raw.length,
        });

        // Best-effort preview
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

    // If scan found keys, try the first few keys from scan first.
    let foundKey: string | null = null;
    let foundVal: any = null;

    const scanKeysToTry = keysLikeProjectId.slice(0, 25);
    for (const k of scanKeysToTry) {
      const v = await tryGet(k);
      if (v != null) {
        foundKey = k;
        foundVal = v;
        break;
      }
    }

    if (!foundKey) {
      for (const k of candidates) {
        const v = await tryGet(k);
        if (v != null) {
          foundKey = k;
          foundVal = v;
          break;
        }
      }
    }

    if (!foundKey) {
      return res.status(200).json({
        ok: true,
        projectId,
        nowIso,
        keysLikeProjectId,
        tried,
        note:
          "No spec found via scan/candidates. Next step: make publish write project:<id>:publishedSpec explicitly (Milestone 2).",
      });
    }

    const previewJson = foundVal;
    const previewStr =
      typeof previewJson === "string" ? clipString(previewJson, 3000) : previewJson;

    return res.status(200).json({
      ok: true,
      projectId,
      nowIso,
      found: {
        key: foundKey,
        type: typeof foundVal,
        bytes:
          typeof foundVal === "string"
            ? foundVal.length
            : JSON.stringify(foundVal).length,
        preview: previewStr,
      },
      keysLikeProjectId,
      tried,
    });
  } catch (e: any) {
    return res.status(500).json({
      ok: false,
      projectId,
      nowIso,
      error: e?.message || String(e),
    });
  }
}

