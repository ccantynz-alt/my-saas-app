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

async function publishStep(projectId: string, dryRun: boolean) {
  if (dryRun) return { projectId, summary: "Publish skipped (dryRun=true)", published: false };
  throw new Error("Publish not wired yet. Set dryRun=true or wire real publish endpoint.");
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

  steps.push(await runStep("publish", () => publishStep(projectId, dryRun)));

  const ok = steps.every((s) => s.ok);

  return json(res, ok ? 200 : 500, {
    ok,
    projectId,
    agent: "auto-publish",
    includeFinishForMe,
    dryRun,
    steps,
  });
}

