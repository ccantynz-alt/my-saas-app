// pages/api/projects/[projectId]/agents/auto-publish.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { json, methodNotAllowed, runStep } from "./_runtime";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return methodNotAllowed(req, res);

  const projectId = String(req.query.projectId || "");

  const steps = [];

  const audit = await runStep("audit", async () => ({ ok: true }));
  steps.push(audit);

  const seo = await runStep("seo", async () => ({ ok: true }));
  steps.push(seo);

  const conversion = await runStep("conversion", async () => ({ ok: true }));
  steps.push(conversion);

  const publish = await runStep("publish", async () => {
    // IMPORTANT:
    // We are NOT calling your publish endpoint yet.
    // First: prove routing is correct and runtime returns JSON.
    return { ok: true, note: "Publish step stub (wire to real publish next)." };
  });
  steps.push(publish);

  const ok = steps.every((s) => s.ok);

  return json(res, ok ? 200 : 500, {
    ok,
    projectId,
    agent: "auto-publish",
    steps,
  });
}
