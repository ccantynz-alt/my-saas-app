// pages/api/projects/[projectId]/agents/auto-publish.ts
import type { NextApiRequest, NextApiResponse } from "next";

type StepResult = {
  step: string;
  ok: boolean;
  status?: number;
  json?: any;
  error?: string;
};

function baseUrl(req: NextApiRequest) {
  const proto =
    (req.headers["x-forwarded-proto"] as string) ||
    (req.headers.referer ? new URL(req.headers.referer).protocol.replace(":", "") : "https");
  const host =
    (req.headers["x-forwarded-host"] as string) ||
    (req.headers.host as string) ||
    (req.headers.referer ? new URL(req.headers.referer).host : "");
  return `${proto}://${host}`;
}

async function callJson(url: string, init: RequestInit): Promise<{ status: number; json: any }> {
  const r = await fetch(url, init);
  const text = await r.text();
  let json: any = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }
  return { status: r.status, json };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ ok: false, error: "Method Not Allowed" });
    }

    const projectId = String(req.query.projectId || "");
    if (!projectId) return res.status(400).json({ ok: false, error: "Missing projectId" });

    const origin = baseUrl(req);
    const steps: StepResult[] = [];

    // 1) Seed draft (safe to run even if draft exists)
    try {
      const { status, json } = await callJson(`${origin}/api/projects/${projectId}/seed-spec`, {
        method: "POST",
        headers: { "content-type": "application/json" },
      });
      steps.push({ step: "seed-spec", ok: status >= 200 && status < 300, status, json });
    } catch (e: any) {
      steps.push({ step: "seed-spec", ok: false, error: e?.message ?? "seed-spec failed" });
    }

    // 2) Finish-for-me
    try {
      const { status, json } = await callJson(
        `${origin}/api/projects/${projectId}/agents/finish-for-me`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
        }
      );
      steps.push({ step: "finish-for-me", ok: status >= 200 && status < 300, status, json });
    } catch (e: any) {
      steps.push({
        step: "finish-for-me",
        ok: false,
        error: e?.message ?? "finish-for-me failed",
      });
    }

    // 3) SEO agent (optional — if missing, we don’t hard fail the whole run)
    try {
      const { status, json } = await callJson(`${origin}/api/projects/${projectId}/agents/seo`, {
        method: "POST",
        headers: { "content-type": "application/json" },
      });
      steps.push({ step: "seo", ok: status >= 200 && status < 300, status, json });
    } catch (e: any) {
      steps.push({ step: "seo", ok: false, error: e?.message ?? "seo failed" });
    }

    // 4) Publish (this is the important one)
    try {
      const { status, json } = await callJson(`${origin}/api/projects/${projectId}/publish`, {
        method: "POST",
        headers: { "content-type": "application/json" },
      });
      steps.push({ step: "publish", ok: status >= 200 && status < 300, status, json });
    } catch (e: any) {
      steps.push({ step: "publish", ok: false, error: e?.message ?? "publish failed" });
    }

    const publishStep = steps.find((s) => s.step === "publish");
    const ok = !!publishStep?.ok;

    return res.status(ok ? 200 : 500).json({
      ok,
      projectId,
      publicUrl: `/p/${projectId}`,
      steps,
    });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message ?? "Unknown error" });
  }
}
