// pages/api/projects/[projectId]/agents/pipeline.ts
import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { kvJsonSet, kvJsonGet, kv } from "@/src/app/lib/kv";

type StepName = "seo-v2" | "sitemap";

type StepResult = {
  step: StepName;
  ok: boolean;
  status: number;
  startedAtIso: string;
  finishedAtIso: string;
  ms: number;
  url: string;
  // keep logs small (first 2KB)
  bodyPreview: string;
};

type JobRecord = {
  ok: true;
  jobId: string;
  projectId: string;
  createdAtIso: string;
  updatedAtIso: string;
  state: "running" | "succeeded" | "failed";
  baseUrl: string;
  steps: StepResult[];
  error?: string;
};

type ApiOk = {
  ok: true;
  projectId: string;
  jobId: string;
  jobKey: string;
  lastJobKey: string;
  record: JobRecord;
};

type ApiErr = {
  ok: false;
  error: string;
};

function nowIso(): string {
  return new Date().toISOString();
}

function getProto(req: NextApiRequest): string {
  const proto = (req.headers["x-forwarded-proto"] as string) || "https";
  return String(proto).split(",")[0].trim();
}

function getHost(req: NextApiRequest): string {
  const host = (req.headers["x-forwarded-host"] as string) || (req.headers.host as string) || "";
  return String(host).split(",")[0].trim().toLowerCase();
}

function baseUrlFromReq(req: NextApiRequest): string {
  const host = getHost(req);
  const proto = getProto(req);
  if (!host) return "https://example.com";
  return `${proto}://${host}`;
}

function jobKey(jobId: string): string {
  return `job:${jobId}`;
}

function projectLastJobKey(projectId: string): string {
  return `project:${projectId}:pipeline:lastJobId`;
}

function safeInt(v: unknown, def: number): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
}

async function runStep(
  req: NextApiRequest,
  step: StepName,
  url: string,
  timeoutMs: number
): Promise<StepResult> {
  const startedAtIso = nowIso();
  const started = Date.now();

  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);

  try {
    const resp = await fetch(url, {
      method: "POST",
      cache: "no-store",
      headers: {
        "x-internal-trigger": "pipeline",
        "x-internal-step": step,
      },
      signal: ctrl.signal,
    });

    const text = await resp.text().catch(() => "");
    const finishedAtIso = nowIso();
    const ms = Date.now() - started;

    return {
      step,
      ok: resp.ok,
      status: resp.status,
      startedAtIso,
      finishedAtIso,
      ms,
      url,
      bodyPreview: String(text).slice(0, 2048),
    };
  } catch (e: any) {
    const finishedAtIso = nowIso();
    const ms = Date.now() - started;

    return {
      step,
      ok: false,
      status: 0,
      startedAtIso,
      finishedAtIso,
      ms,
      url,
      bodyPreview: `ERROR: ${e?.message || String(e)}`.slice(0, 2048),
    };
  } finally {
    clearTimeout(t);
  }
}

async function writeJob(job: JobRecord): Promise<void> {
  job.updatedAtIso = nowIso();
  await kvJsonSet(jobKey(job.jobId), job);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiOk | ApiErr>) {
  const projectId = String(req.query.projectId || "").trim();
  if (!projectId) return res.status(400).json({ ok: false, error: "Missing projectId" });

  const jobId = crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString("hex");
  const baseUrl = baseUrlFromReq(req);

  const job: JobRecord = {
    ok: true,
    jobId,
    projectId,
    createdAtIso: nowIso(),
    updatedAtIso: nowIso(),
    state: "running",
    baseUrl,
    steps: [],
  };

  const jKey = jobKey(jobId);
  const lastKey = projectLastJobKey(projectId);

  if (req.method === "GET") {
    // GET supports:
    // - ?jobId=<id> to read a specific job
    // - default: reads last job for project
    const qJobId = String(req.query.jobId || "").trim();

    let readJobId = qJobId;
    if (!readJobId) {
      const last = await kv.get(lastKey).catch(() => null);
      if (last) readJobId = String(last).trim();
    }

    if (!readJobId) {
      return res.status(404).json({ ok: false, error: "No jobId found (no last job recorded yet)" });
    }

    const record = await kvJsonGet<JobRecord>(jobKey(readJobId)).catch(() => null);
    if (!record?.ok) {
      return res.status(404).json({ ok: false, error: `Job not found: ${readJobId}` });
    }

    return res.status(200).json({
      ok: true,
      projectId,
      jobId: record.jobId,
      jobKey: jobKey(record.jobId),
      lastJobKey: lastKey,
      record,
    });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  // Pipeline controls (safe defaults)
  const seoTargetCount = Math.min(Math.max(safeInt(req.query.targetCount, 5000), 50), 200000);
  const seoChunkSize = Math.min(Math.max(safeInt(req.query.chunkSize, 500), 100), 2000);

  const stepTimeoutMs = Math.min(Math.max(safeInt(process.env.PIPELINE_STEP_TIMEOUT_MS, 20000), 3000), 120000);

  // URLs for the existing agents
  const seoUrl = `${baseUrl}/api/projects/${encodeURIComponent(
    projectId
  )}/agents/seo-v2?targetCount=${encodeURIComponent(String(seoTargetCount))}&chunkSize=${encodeURIComponent(
    String(seoChunkSize)
  )}&ts=${Date.now()}`;

  const sitemapUrl = `${baseUrl}/api/projects/${encodeURIComponent(projectId)}/agents/sitemap?ts=${Date.now()}`;

  // Write initial job + last job pointer
  await writeJob(job);
  await kv.set(lastKey, jobId);

  // Run steps sequentially (reliable). Status updates after each step.
  const step1 = await runStep(req, "seo-v2", seoUrl, stepTimeoutMs);
  job.steps.push(step1);
  await writeJob(job);

  if (!step1.ok) {
    job.state = "failed";
    job.error = `Step failed: seo-v2 (status ${step1.status || "ERR"})`;
    await writeJob(job);
    return res.status(200).json({
      ok: true,
      projectId,
      jobId,
      jobKey: jKey,
      lastJobKey: lastKey,
      record: job,
    });
  }

  const step2 = await runStep(req, "sitemap", sitemapUrl, stepTimeoutMs);
  job.steps.push(step2);
  await writeJob(job);

  if (!step2.ok) {
    job.state = "failed";
    job.error = `Step failed: sitemap (status ${step2.status || "ERR"})`;
    await writeJob(job);
    return res.status(200).json({
      ok: true,
      projectId,
      jobId,
      jobKey: jKey,
      lastJobKey: lastKey,
      record: job,
    });
  }

  job.state = "succeeded";
  await writeJob(job);

  return res.status(200).json({
    ok: true,
    projectId,
    jobId,
    jobKey: jKey,
    lastJobKey: lastKey,
    record: job,
  });
}
