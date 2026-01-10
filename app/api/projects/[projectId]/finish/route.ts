import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { auth } from "@clerk/nextjs/server";
import {
  buildDemoHtml,
  createRun,
  setProjectHtml,
  setRunStatus,
} from "@/lib/demoStore";

export const runtime = "nodejs";

type Project = {
  id: string;
  ownerId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

function nowIso() {
  return new Date().toISOString();
}

function projectKey(projectId: string) {
  return `project:${projectId}`;
}

function userProjectsKey(userId: string) {
  return `projects:user:${userId}`;
}

function generatedProjectLatestKey(projectId: string) {
  return `generated:project:${projectId}:latest`;
}

async function ensureProjectExists(projectId: string, userId: string) {
  const existing = await kv.get<Project>(projectKey(projectId));

  if (!existing) {
    const createdAt = nowIso();
    const project: Project = {
      id: projectId,
      ownerId: userId,
      name: "Untitled Project",
      createdAt,
      updatedAt: createdAt,
    };

    await kv.set(projectKey(projectId), project);
    await kv.lpush(userProjectsKey(userId), projectId);

    return project;
  }

  if (existing.ownerId !== userId) {
    return null; // forbidden
  }

  return existing;
}

function makePrompt(input: {
  businessName: string;
  niche: string;
  location: string;
  tone: string;
}) {
  const businessName = (input.businessName || "A professional business").trim();
  const niche = (input.niche || "services").trim();
  const location = (input.location || "").trim();
  const tone = (input.tone || "professional").trim();

  const locPart = location ? ` in ${location}` : "";
  return `${businessName}${locPart} — ${tone} ${niche} website with hero, services, about, testimonials (clearly labeled as examples), FAQs, contact, and footer. Include SEO title + meta description. Clean modern styling.`;
}

function stripTags(s: string) {
  return s.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function ensureHeadBasics(html: string, opts: { title: string; description: string }) {
  let out = html;

  // Ensure <head> exists
  if (!/<head[\s>]/i.test(out)) {
    // If there's an <html>, inject head after it; otherwise wrap minimally.
    if (/<html[\s>]/i.test(out)) {
      out = out.replace(/<html([^>]*)>/i, `<html$1><head></head>`);
    } else {
      out = `<!doctype html><html><head></head><body>${out}</body></html>`;
    }
  }

  // Ensure <title>
  if (!/<title>.*<\/title>/i.test(out)) {
    out = out.replace(/<head([^>]*)>/i, `<head$1><title>${opts.title}</title>`);
  } else {
    out = out.replace(/<title>.*<\/title>/i, `<title>${opts.title}</title>`);
  }

  // Ensure meta description
  if (!/name=["']description["']/i.test(out)) {
    out = out.replace(
      /<head([^>]*)>/i,
      `<head$1><meta name="description" content="${opts.description}">`
    );
  } else {
    out = out.replace(
      /<meta[^>]*name=["']description["'][^>]*>/i,
      `<meta name="description" content="${opts.description}">`
    );
  }

  // Ensure viewport (nice-to-have)
  if (!/name=["']viewport["']/i.test(out)) {
    out = out.replace(
      /<head([^>]*)>/i,
      `<head$1><meta name="viewport" content="width=device-width, initial-scale=1">`
    );
  }

  return out;
}

function ensureSingleH1(html: string, h1Text: string) {
  let out = html;

  // If no H1, add one near top of body
  if (!/<h1[\s>]/i.test(out)) {
    if (/<body[\s>]/i.test(out)) {
      out = out.replace(/<body([^>]*)>/i, `<body$1><h1>${h1Text}</h1>`);
    } else {
      out = `<h1>${h1Text}</h1>\n` + out;
    }
    return out;
  }

  // If multiple H1s, keep the first and downgrade the rest to H2
  const h1Matches = out.match(/<h1[\s>][\s\S]*?<\/h1>/gi) || [];
  if (h1Matches.length > 1) {
    let firstDone = false;
    out = out.replace(/<h1([\s>][\s\S]*?)<\/h1>/gi, (m) => {
      if (!firstDone) {
        firstDone = true;
        return `<h1>${h1Text}</h1>`;
      }
      // downgrade remaining h1 to h2
      return m.replace(/^<h1/i, "<h2").replace(/<\/h1>$/i, "</h2>");
    });
    return out;
  }

  // Exactly one H1: replace its content with our chosen text (keeps layout stable enough)
  out = out.replace(/<h1[\s>][\s\S]*?<\/h1>/i, `<h1>${h1Text}</h1>`);
  return out;
}

function qualityAndSeoPass(html: string, input: { businessName: string; niche: string; location: string }) {
  const businessName = (input.businessName || "A professional business").trim();
  const niche = (input.niche || "services").trim();
  const location = (input.location || "").trim();

  const title = location
    ? `${businessName} | ${niche} in ${location}`
    : `${businessName} | ${niche}`;

  // Keep description short-ish
  const descriptionBase = location
    ? `${businessName} provides ${niche} in ${location}.`
    : `${businessName} provides ${niche}.`;

  const description = `${descriptionBase} Get a fast quote, learn about our services, and contact us today.`;

  // 1) Head basics
  let out = ensureHeadBasics(html, { title, description });

  // 2) H1 rules
  const h1Text = location ? `${businessName} — ${niche} in ${location}` : `${businessName} — ${niche}`;
  out = ensureSingleH1(out, h1Text);

  // 3) Remove obvious lorem ipsum
  out = out.replace(/lorem ipsum/gi, "");

  // 4) Ensure there's some contact cue (very light touch)
  if (!/contact/i.test(out)) {
    out = out + `\n<!-- Contact: Please add a contact section if missing -->\n`;
  }

  // 5) Make sure description isn't empty or nonsense
  const textCheck = stripTags(out);
  if (textCheck.length < 200) {
    // If it's too short, append a safe filler section (still deterministic)
    out =
      out +
      `\n<section><h2>Why choose ${businessName}?</h2><p>We focus on clear communication, reliable delivery, and quality results. Reach out today to discuss your needs and get a quick quote.</p></section>\n`;
  }

  return { html: out, seo: { title, description, h1: h1Text } };
}

async function tryAutoPublish(req: Request, projectId: string) {
  // Best-effort: if a publish route exists, call it.
  // If it doesn't exist or fails, we still return ok with published=false.
  const url = new URL(req.url);
  const origin = url.origin;

  try {
    const res = await fetch(`${origin}/api/projects/${projectId}/publish`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ source: "finish-level-2" }),
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      return { published: false, status: res.status, body: txt };
    }

    const data: any = await res.json().catch(() => ({}));
    return { published: true, status: res.status, body: data };
  } catch (e: any) {
    return { published: false, status: 0, body: String(e?.message || e) };
  }
}

export async function POST(req: Request, ctx: { params: { projectId: string } }) {
  const session = await auth();
  const userId = session.userId;

  if (!userId) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const projectId = ctx.params.projectId;
  if (!projectId || typeof projectId !== "string") {
    return NextResponse.json({ ok: false, error: "Missing projectId" }, { status: 400 });
  }

  const project = await ensureProjectExists(projectId, userId);
  if (!project) {
    return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
  }

  // Parse input
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const businessName = String(body?.businessName || body?.name || "").trim();
  const niche = String(body?.niche || body?.industry || "").trim();
  const location = String(body?.location || body?.city || "").trim();
  const tone = String(body?.tone || "professional").trim();

  const run = createRun(projectId);
  setRunStatus(run.id, "running");

  // STEP 1: Generate base HTML
  const prompt = makePrompt({ businessName, niche, location, tone });
  let html = buildDemoHtml(prompt);

  // STEP 2 + 3: Quality + SEO pass
  const refined = qualityAndSeoPass(html, { businessName, niche, location });
  html = refined.html;

  // Store HTML in BOTH places:
  // - demoStore (your current UI uses this)
  // - KV generated key (your import route uses this pattern)
  setProjectHtml(projectId, html);
  await kv.set(generatedProjectLatestKey(projectId), html);
  await kv.set("generated:latest", html);

  // Update project updatedAt
  await kv.set(projectKey(projectId), { ...project, updatedAt: nowIso() });

  setRunStatus(run.id, "complete");

  // STEP 5: Auto-publish (best effort)
  const pub = await tryAutoPublish(req, projectId);

  return NextResponse.json({
    ok: true,
    projectId,
    runId: run.id,
    seo: refined.seo,
    published: pub.published,
    publishResult: pub,
  });
}
