import type { NextApiRequest, NextApiResponse } from "next";
import { kvGetJson } from "@/lib/kv";

const CANDIDATE_KEYS = [
  // common
  `project:{projectId}:siteSpec`,
  `project:{projectId}:spec`,
  `project:{projectId}:draftSpec`,
  `project:{projectId}:publishedSpec`,

  // older/alt patterns (safe to try)
  `projects:{projectId}:siteSpec`,
  `projects:{projectId}:spec`,
  `siteSpec:{projectId}`,
  `spec:{projectId}`,
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ ok: false, error: "Method Not Allowed", allow: ["GET"] });
  }

  const projectId = String(req.query.projectId || "").trim();
  if (!projectId) return res.status(400).json({ ok: false, error: "Missing projectId" });

  const tried: Array<{ key: string; found: boolean; type: string | null }> = [];

  for (const raw of CANDIDATE_KEYS) {
    const key = raw.replace("{projectId}", projectId);
    const v = await kvGetJson<any>(key);
    const found = v != null;
    tried.push({ key, found, type: found ? typeof v : null });

    if (found) {
      return res.status(200).json({
        ok: true,
        projectId,
        foundKey: key,
        preview: summarize(v),
        full: v,
        tried,
      });
    }
  }

  return res.status(404).json({
    ok: false,
    projectId,
    error: "No spec found in KV under known keys",
    tried,
  });
}

function summarize(v: any) {
  // keep it small but useful
  const out: any = {};
  if (v?.brandName) out.brandName = v.brandName;
  if (v?.brand?.name) out.brand = v.brand?.name;
  if (v?.headline) out.headline = v.headline;
  if (v?.hero?.headline) out.heroHeadline = v.hero?.headline;
  if (Array.isArray(v?.features)) out.featuresCount = v.features.length;
  if (v?.pricing) out.pricing = Object.keys(v.pricing || {});
  return out;
}
