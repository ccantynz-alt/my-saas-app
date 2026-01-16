import type { NextApiRequest, NextApiResponse } from "next";

type StepLog = {
  name: string;
  ok: boolean;
  ms: number;
  url?: string;
  status?: number;
  ct?: string | null;
  result?: any;
  error?: string | null;
  skipped?: boolean;
};

function getBaseUrl(req: NextApiRequest) {
  const proto = (req.headers["x-forwarded-proto"] as string) || "https";
  const host = req.headers.host;
  return `${proto}://${host}`;
}

async function readJsonSafe(r: Response) {
  const ct = r.headers.get("content-type");
  const text = await r.text();
  try {
    return { ct, text, json: text ? JSON.parse(text) : null };
  } catch {
    return { ct, text, json: null };
  }
}

async function callJsonStep(args: {
  name: string;
  url: string;
  method?: "POST" | "GET";
  body?: any;
}): Promise<StepLog> {
  const { name, url } = args;
  const method = args.method ?? "POST";
  const started = Date.now();

  try {
    const hasBody = args.body !== undefined;
    const r = await fetch(url, {
      method,
      headers: hasBody ? { "Content-Type": "application/json" } : undefined,
      body: hasBody ? JSON.stringify(args.body) : undefined,
    });

    const { ct, text, json } = await readJsonSafe(r);
    const ms = Date.now() - started;

    if (!r.ok) {
      const msg =
        (json && (json.error || json.message)) ||
        (text ? `Non-OK response: ${text}` : `Non-OK response status=${r.status}`);

      return {
        name,
        ok: false,
        ms,
        url,
        status: r.status,
        ct,
        result: json ?? (text ? { raw: text } : null),
        error: `${name} failed: status=${r.status} ct=${ct} body=${json ? JSON.stringify(json) : text}`,
      };
    }

    return {
      name,
      ok: true,
      ms,
      url,
      status: r.status,
      ct,
      result: json ?? (text ? { raw: text } : null),
      error: null,
    };
  } catch (e: any) {
    const ms = Date.now() - started;
    return {
      name,
      ok: false,
      ms,
      url,
      error: `${name} threw: ${e?.message || String(e)}`,
    };
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // POST-only (matches your deployed behavior and avoids accidental GET confusion)
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ ok: false, error: "Method Not Allowed", allow: ["POST"] });
  }

  const projectId = String(req.query.projectId || "");

  // Build tag + git sha for easy “what’s deployed?” verification
  const gitSha =
    process.env.VERCEL_GIT_COMMIT_SHA ||
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ||
    null;

  const buildTag = "auto-publish-selfheal-v1";

  // Body parsing (Next can give object or string depending on config)
  let body: any = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }
  body = body || {};

  const dryRun = body.dryRun === undefined ? true : Boolean(body.dryRun);
  const includeFinishForMe = body.includeFinishForMe === undefined ? true : Boolean(body.includeFinishForMe);

  const baseUrl = getBaseUrl(req);

  // Canonical routes (Pages API)
  const routes = {
    audit: `${baseUrl}/api/projects/${projectId}/audit`,
    seo: `${baseUrl}/api/projects/${projectId}/agents/seo`,
    conversion: `${baseUrl}/api/projects/${projectId}/agents/conversion`,
    finishForMe: `${baseUrl}/api/projects/${projectId}/agents/finish-for-me`,
    seedSpec: `${baseUrl}/api/projects/${projectId}/seed-spec`,
    publish: `${baseUrl}/api/projects/${projectId}/publish`,
  };

  const steps: StepLog[] = [];

  // Step 1 — audit
  steps.push(await callJsonStep({ name: "audit", url: routes.audit, method: "POST" }));
  if (!steps[steps.length - 1].ok) {
    return res.status(500).json({
      ok: false,
      projectId,
      agent: "auto-publish",
      dryRun,
      includeFinishForMe,
      buildTag,
      gitSha,
      steps,
    });
  }

  // Step 2 — seo
  steps.push(await callJsonStep({ name: "seo", url: routes.seo, method: "POST" }));
  if (!steps[steps.length - 1].ok) {
    return res.status(500).json({
      ok: false,
      projectId,
      agent: "auto-publish",
      dryRun,
      includeFinishForMe,
      buildTag,
      gitSha,
      steps,
    });
  }

  // Step 3 — conversion
  steps.push(await callJsonStep({ name: "conversion", url: routes.conversion, method: "POST" }));
  if (!steps[steps.length - 1].ok) {
    return res.status(500).json({
      ok: false,
      projectId,
      agent: "auto-publish",
      dryRun,
      includeFinishForMe,
      buildTag,
      gitSha,
      steps,
    });
  }

  // Step 4 — finish-for-me (optional)
  if (includeFinishForMe) {
    steps.push(await callJsonStep({ name: "finish-for-me", url: routes.finishForMe, method: "POST" }));
    if (!steps[steps.length - 1].ok) {
      return res.status(500).json({
        ok: false,
        projectId,
        agent: "auto-publish",
        dryRun,
        includeFinishForMe,
        buildTag,
        gitSha,
        steps,
      });
    }
  } else {
    steps.push({
      name: "finish-for-me",
      ok: true,
      ms: 0,
      skipped: true,
      error: null,
      result: { skipped: true, reason: "includeFinishForMe=false" },
    });
  }

  // Step 5 — publish (dry-run support + self-heal)
  if (dryRun) {
    steps.push({
      name: "publish",
      ok: true,
      ms: 0,
      skipped: true,
      error: null,
      result: { skipped: true, reason: "dryRun=true" },
    });

    return res.status(200).json({
      ok: true,
      projectId,
      agent: "auto-publish",
      dryRun,
      includeFinishForMe,
      buildTag,
      gitSha,
      steps,
    });
  }

  // Real publish attempt #1
  let publishStep = await callJsonStep({ name: "publish", url: routes.publish, method: "POST" });

  // Self-heal: if publish fails due to missing spec, seed-spec then retry publish ONCE
  const publishErr = publishStep.error || "";
  const publishBody = publishStep.result;
  const publishMissingSpec =
    publishStep.status === 400 &&
    (
      publishErr.includes("No site spec found to publish") ||
      (publishBody && typeof publishBody === "object" && String(publishBody.error || "").includes("No site spec found"))
    );

  if (!publishStep.ok && publishMissingSpec) {
    // Record the failed publish attempt as part of the log
    steps.push(publishStep);

    // Seed spec
    const seed = await callJsonStep({ name: "seed-spec", url: routes.seedSpec, method: "POST" });
    steps.push(seed);

    if (!seed.ok) {
      return res.status(500).json({
        ok: false,
        projectId,
        agent: "auto-publish",
        dryRun,
        includeFinishForMe,
        buildTag,
        gitSha,
        steps,
      });
    }

    // Retry publish once
    const retry = await callJsonStep({ name: "publish-retry", url: routes.publish, method: "POST" });
    steps.push(retry);

    if (!retry.ok) {
      return res.status(500).json({
        ok: false,
        projectId,
        agent: "auto-publish",
        dryRun,
        includeFinishForMe,
        buildTag,
        gitSha,
        steps,
      });
    }

    // Success on retry
    return res.status(200).json({
      ok: true,
      projectId,
      agent: "auto-publish",
      dryRun,
      includeFinishForMe,
      buildTag,
      gitSha,
      publicUrl: retry.result?.publicUrl || null,
      publishedAtIso: retry.result?.publishedAtIso || null,
      steps,
    });
  }

  // Normal path: record publish and return
  steps.push(publishStep);

  if (!publishStep.ok) {
    return res.status(500).json({
      ok: false,
      projectId,
      agent: "auto-publish",
      dryRun,
      includeFinishForMe,
      buildTag,
      gitSha,
      steps,
    });
  }

  return res.status(200).json({
    ok: true,
    projectId,
    agent: "auto-publish",
    dryRun,
    includeFinishForMe,
    buildTag,
    gitSha,
    publicUrl: publishStep.result?.publicUrl || null,
    publishedAtIso: publishStep.result?.publishedAtIso || null,
    steps,
  });
}
