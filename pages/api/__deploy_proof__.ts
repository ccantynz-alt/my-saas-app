import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store");

  res.status(200).json({
    ok: true,
    token: process.env.DEPLOY_PROOF_TOKEN || "D8-MISSING-TOKEN",
    builtAtUtc: new Date().toISOString(),
    gitSha: process.env.VERCEL_GIT_COMMIT_SHA || "unknown",
    vercelEnv: process.env.VERCEL_ENV || "unknown",
  });
}
