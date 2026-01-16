// pages/api/projects/[projectId]/publish.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { kv } from "@vercel/kv";

export const config = {
  api: {
    bodyParser: true,
  },
};

function json(res: NextApiResponse, status: number, data: any) {
  res.status(status).setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data));
}

function asString(v: unknown): string {
  if (typeof v === "string") return v;
  if (v == null) return "";
  try {
    return String(v);
  } catch {
    return "";
  }
}

type AuditResult = { readyToPublish: boolean; reasons?: string[] };

function runAudit(html: string): AuditResult {
  const reasons: string[] = [];
  if (!html || html.trim().length < 50) reasons.push("HTML too short");
  if (!html.includes("<html")) reasons.push("Missing <html>");
  if (!html.includes("<body")) reasons.push("Missing <body>");
  if (!html.includes("<title")) reasons.push("Missing <title>");
  return { readyToPublish: reasons.length === 0, reasons };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { ok: false, error: "Method Not Allowed" });
  }

  const projectId = asString(req.query.projectId);
  if (!projectId) return json(res, 400, { ok: false, error: "Missing projectId" });

  // Load generated HTML (matches your bootstrap flow)
  const genKey = `generated:project:${projectId}:latest`;
  const html = asString(await kv.get(genKey));

  if (!html) {
    return json(res, 400, {
      ok: false,
      error: "No generated HTML found. Run Finish first.",
      genKey,
    });
  }

  // Audit gate
  const audit = runAudit(html);
  if (!audit.readyToPublish) {
    return json(res, 409, { ok: false, error: "Not ready to publish", audit });
  }

  // Publish HTML
  const pubHtmlKey = `published:project:${projectId}:latest`;
  await kv.set(pubHtmlKey, html);

  // ✅ Publish SPEC for inspector
  const publishedAtIso = new Date().toISOString();

  const publishedSpec = {
    projectId,
    publishedAtIso,
    html,
    htmlKey: pubHtmlKey,
    audit,
    sourceKey: genKey,
  };

  const pubSpecKey = `project:${projectId}:publishedSpec`;
  await kv.set(pubSpecKey, JSON.stringify(publishedSpec));

  // Extra aliases (optional but helps future code)
  await kv.set(`project:${projectId}:publishedAtIso`, publishedAtIso);
  await kv.set(`project:${projectId}:spec`, JSON.stringify(publishedSpec));
  await kv.set(`project:${projectId}:latestSpec`, JSON.stringify(publishedSpec));

  return json(res, 200, {
    ok: true,
    projectId,
    publishedAtIso,
    publicUrl: `/p/${projectId}`,
    wrote: { pubHtmlKey, pubSpecKey },
  });
}
