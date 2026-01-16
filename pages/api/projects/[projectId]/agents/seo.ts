// pages/api/projects/[projectId]/agents/seo.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { json, methodNotAllowed, runStep } from "./_runtime";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return methodNotAllowed(req, res);

  const projectId = String(req.query.projectId || "");

  const result = await runStep("seo", async () => {
    // TODO: Replace with real SEO logic later.
    return {
      projectId,
      summary: "SEO stub OK (routing + runtime verified).",
      pagesPlanned: ["Home", "About", "Contact"],
      metaPlanned: { title: "Demo Title", description: "Demo Description" },
    };
  });

  return json(res, 200, { ok: result.ok, projectId, result });
}
