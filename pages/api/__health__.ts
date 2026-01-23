import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store");
  return res.status(200).json({
    ok: true,
    nowIso: new Date().toISOString(),
    method: req.method,
    url: req.url || null,
    vercelEnv: process.env.VERCEL_ENV || process.env.NODE_ENV || null,
  });
}