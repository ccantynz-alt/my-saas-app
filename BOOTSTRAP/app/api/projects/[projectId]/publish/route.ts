// BOOTSTRAP/app/api/projects/[projectId]/publish/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { kv } from "@vercel/kv";
import { auth } from "@clerk/nextjs/server";

export const runtime = "nodejs";

/**
 * Safe helpers
 */
function asText(v: unknown): string {
  if (typeof v === "string") return v;
  if (v == null) return "";
  try {
    return String(v);
  } catch {
    return "";
  }
}

type AuditResult = {
  readyToPublish: boolean;
  reasons?: string[];
};

function runAudit(html: string): AuditResult {
  const reasons: string[] = [];

  if (!html || html.trim().length < 50) reasons.push("HTML too short");
  if (!html.includes("<html")) reasons.push("Missing <html>");
  if (!html.includes("<body")) reasons.push("Missing <body>");
  if (!html.includes("<title")) reasons.push("Missing <title>");

  return {
    readyToPublish: reasons.length === 0,
    reasons,
  };
}

/**
 * Pro check (robust: tries multiple keys)
 * You can wire this into your real billing later.
 */
async function isProUser(userId: string): Promise<boolean> {
  const keys = [
    `user:${userId}:isPro`,
    `user:${userId}:pro`,
    `debug:user:${userId}:isPro`,
    `debug:pro:${userId}`,
  ];

  for (const k of keys) {
    const v = await kv.get(k);
    if (v === true) return true;
    if (v === "true") return true;
    if (v === 1) return true;
    if (v === "1") return true;
    if (v === "pro") return true;
  }

  return false;
}

async function createUpgradeUrl(origin: string, userId: string, projectId: string) {
  // Minimal safe upgrade link (doesn't assume Stripe wiring here)
  const base = origin || "";
  const path = `/upgrade?projectId=${encodeURIComponent(projectId)}&u=${encodeURIComponent(userId)}`;
  return base ? `${base}${path}` : path;
}

export async function POST(req: NextRequest, ctx: { params: { projectId: string } }) {
  // Auth
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const projectId = ctx.params.projectId;

  // Load generated HTML
  const genKey = `generated:project:${projectId}:latest`;
  const html = asText(await kv.get(genKey));

  if (!html) {
    return NextResponse.json(
      { ok: false, error: "No generated HTML found. Run Finish first." },
      { status: 400 }
    );
  }

  // Audit gate
  const audit = runAudit(html);
  if (!audit.readyToPublish) {
    return NextResponse.json(
      {
        ok: false,
        error: "Not ready to publish",
        audit,
      },
      { status: 409 }
    );
  }

  // Pro gate
  const pro = await isProUser(userId);
  if (!pro) {
    const upgradeUrl = await createUpgradeUrl(req.headers.get("origin") || "", userId, projectId);
    return NextResponse.json(
      {
        ok: false,
        error: "Upgrade required",
        upgradeUrl,
      },
      { status: 402 }
    );
  }

  // Publish HTML
  const pubHtmlKey = `published:project:${projectId}:latest`;
  await kv.set(pubHtmlKey, html);

  // ✅ Publish SPEC (this is what your /debug/spec inspector is looking for)
  const publishedAtIso = new Date().toISOString();

  const publishedSpec = {
    projectId,
    publishedAtIso,
    // Keep HTML inline for bootstrap reliability (no guessing about renderer expectations)
    html,
    // Also store where HTML was written
    htmlKey: pubHtmlKey,
    // Include minimal audit info for debugging
    audit,
    // Helpful trace
    sourceKey: genKey,
  };

  // Canonical key (your inspector expects this)
  const pubSpecKey = `project:${projectId}:publishedSpec`;
  await kv.set(pubSpecKey, JSON.stringify(publishedSpec));

  // Helpful aliases (optional but makes the system more robust)
  await kv.set(`project:${projectId}:publishedAtIso`, publishedAtIso);
  await kv.set(`project:${projectId}:spec`, JSON.stringify(publishedSpec));
  await kv.set(`project:${projectId}:latestSpec`, JSON.stringify(publishedSpec));

  return NextResponse.json({
    ok: true,
    projectId,
    publishedAtIso,
    publicUrl: `/p/${projectId}`,
  });
}
