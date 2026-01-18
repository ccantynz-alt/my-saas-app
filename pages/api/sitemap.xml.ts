// pages/sitemap.xml.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { kv } from "@/src/app/lib/kv";

function getHost(req: NextApiRequest): string {
  const xfHost = (req.headers["x-forwarded-host"] as string) || "";
  const host = xfHost || (req.headers.host as string) || "";
  return String(host).split(",")[0].trim().toLowerCase();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Resolution order:
  // 1) ?projectId=... (explicit)
  // 2) domain:<host>:projectId mapping in KV (for real custom domains)
  const explicit = String(req.query.projectId || "").trim();
  const host = getHost(req);

  let projectId = explicit;

  if (!projectId && host) {
    const mapped = await kv.get(`domain:${host}:projectId`).catch(() => null);
    if (mapped) projectId = String(mapped).trim();
  }

  if (!projectId) {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.status(404).send(
      [
        "Missing projectId for sitemap.",
        "",
        "Use:",
        "  /sitemap.xml?projectId=<yourProjectId>",
        "",
        "Or set a domain mapping key in KV:",
        "  domain:<host>:projectId => <yourProjectId>",
        "",
        `Detected host: ${host || "(none)"}`,
      ].join("\n")
    );
  }

  const sitemapKey = `project:${projectId}:sitemapXml`;
  const xml = await kv.get(sitemapKey).catch(() => null);

  if (!xml) {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    return res.status(404).send(
      [
        "Sitemap not found for project.",
        "",
        `projectId: ${projectId}`,
        `key: ${sitemapKey}`,
        "",
        "Fix:",
        "  1) POST /api/projects/<projectId>/agents/seo-v2",
        "  2) POST /api/projects/<projectId>/agents/sitemap",
      ].join("\n")
    );
  }

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=60, s-maxage=300, stale-while-revalidate=86400");
  return res.status(200).send(String(xml));
}
