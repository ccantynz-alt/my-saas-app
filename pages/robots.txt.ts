// pages/robots.txt.ts
import type { NextApiRequest, NextApiResponse } from "next";

function getProto(req: NextApiRequest): string {
  const xfProto = (req.headers["x-forwarded-proto"] as string) || "https";
  return String(xfProto).split(",")[0].trim();
}

function getHost(req: NextApiRequest): string {
  const xfHost = (req.headers["x-forwarded-host"] as string) || "";
  const host = xfHost || (req.headers.host as string) || "";
  return String(host).split(",")[0].trim();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const proto = getProto(req);
  const host = getHost(req);

  // Keep it simple and valid. Sitemap supports ?projectId= for now.
  // Once you have domain:<host>:projectId mapping, it will auto-resolve without query params.
  const sitemapUrl = host ? `${proto}://${host}/sitemap.xml` : `/sitemap.xml`;

  const body = [
    "User-agent: *",
    "Allow: /",
    `Sitemap: ${sitemapUrl}`,
    "",
  ].join("\n");

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=60, s-maxage=300, stale-while-revalidate=86400");
  return res.status(200).send(body);
}
