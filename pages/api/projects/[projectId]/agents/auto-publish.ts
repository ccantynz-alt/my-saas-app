// pages/api/projects/[projectId]/agents/auto-publish.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { json, methodNotAllowed, runStep } from "./_runtime";

type Body = {
  includeFinishForMe?: boolean;
  dryRun?: boolean;
};

function safeJsonParse(input: any): any {
  if (!input) return {};
  if (typeof input === "object") return input;
  try {
    return JSON.parse(String(input));
  } catch {
    return {};
  }
}

async function auditStep(projectId: string) {
  return { projectId, summary: "Audit OK (stub)", issues: [], recommendations: [] };
}

async function seoStep(projectId: string) {
  return {
    projectId,
    summary: "SEO OK (stub)",
    pagesPlanned: ["Home", "About", "Contact"],
    metaPlanned: { title: "Demo Title", description: "Demo Description" },
  };
}

async function conversionStep(projectId: string) {
  return { projectId, summary: "Conversion OK (stub)", ctas: ["Start Free", "Book a Call", "Get a Quote"] };
}

async function finishForMeStep(projectId: string) {
  return {
    projectId,
    summary: "Finish-for-me OK (stub)",
    changes: ["Hero copy refreshed", "Added FAQ section", "Improved CTA placement"],
  };
}

/**
 * Calls the real publish handler at: pages/api/projects/[projectId]/publish.ts
 * We do an internal HTTP call to the same deployment origin so it reuses the same runtime/env.
 */
async function callPublishEndpoint(req: NextApiRequest, projectId: string) {
  const origin =
    (req.headers["x-forwarded-proto"] ? String(req.headers["x-forwarded-proto"]) : "https") +
    "://" +
    String(req.headers["x-forwarded-host"] || req.headers.host);

  const url = `${origin}/api/projects/${encodeURIComponent(projectId)}/publish?ts=${Date.now()}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      // Forward cookies so auth/session behaves the same as a browser call.
      cookie: String(req.headers.cookie || ""),
      "content-type": "application/json",
    },
    body: JSON.stringify({}),
  });

  const ct = res.headers.get("content-type") || "";
  const text = await res.text();

  let parsed: any = null;
  if (ct.includes("application/json")) {
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = null;
    }
  }

  if (!res.ok) {
    const msg = `Publish failed: status=${res.status} ct=${ct} body=${text.slice(0, 400)}`;
    throw new Error(msg);
  }

  return {
    status: res.status,
    ct,
    body: parsed ?? text,
  };
}

async function publishStep(req: NextApiRequest, projectId: string, dryRun: boolean) {
  if (dryRun) return { projectId, summary: "Publish skipped (dryRun=true)", published: false };

  const result = await callPublishEndpoint(req, projectId);

  // Try to extract common fields if your publish handler returns them.
  const publishedAtIso =
    result && typeof result.body === "object"
      ? result.body.publishedAtIso || result.body.publishedAt || result.body.publishedAtISO
      : undefined;

  const publicUrl =
    result && typeof result.body === "object"
      ? result.body.publicUrl || result.body.url || result.body.publicURL
      : undefined;

  return {
    projectId,
    summary: "Publish OK",
    published: true,
    publishedAtIso: publishedAtIso ?? null,
    publicUrl: publicUrl ?? null,
    publishResponse: result.body,
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return methodNotAllowed(req, res);

  const projectId = String(req.query.projectId || "");
  const body = safeJsonParse(req.body) as Body;

  const includeFinishForMe = body.includeFinishForMe ?? true;
  const dryRun = body.dryRun ?? true;

  const steps: any[] = [];

  steps.push(await runStep("audit", () => auditStep(projectId)));
  steps.push(await runStep("seo", () => seoStep(projectId)));
  steps.push(await runStep("conversion", () => conversionStep(projectId)));

  if (includeFinishForMe) {
    steps.push(await runStep("finish-for-me", () => finishForMeStep(projectId)));
  }

  steps.push(await runStep("publish", () => publishStep(req, projectId, dryRun)));

  const ok = steps.every((s) => s.ok);

  return json(res, ok ? 200 : 500, {
    ok,
    projectId,
    agent: "auto-publish",
    includeFinishForMe,
    dryRun,
    steps,
    publishedAtIso: steps.find((s) => s.step === "publish")?.result?.publishedAtIso ?? null,
    publicUrl: steps.find((s) => s.step === "publish")?.result?.publicUrl ?? null,
  });
}
