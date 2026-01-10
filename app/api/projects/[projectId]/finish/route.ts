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

  // Ensure viewport
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

  if (!/<h1[\s>]/i.test(out)) {
    if (/<body[\s>]/i.test(out)) {
      out = out.replace(/<body([^>]*)>/i, `<body$1><h1>${h1Text}</h1>`);
    } else {
      out = `<h1>${h1Text}</h1>\n` + out;
    }
    return out;
  }

  const h1Matches = out.match(/<h1[\s>][\s\S]*?<\/h1>/gi) || [];
  if (h1Matches.length > 1) {
    let firstDone = false;
    out = out.replace(/<h1([\s>][\s\S]*?)<\/h1>/gi, (m) => {
      if (!firstDone) {
        firstDone = true;
        return `<h1>${h1Text}</h1>`;
      }
      return m.replace(/^<h1/i, "<h2").replace(/<\/h1>$/i, "</h2>");
    });
    return out;
  }

  out = out.replace(/<h1[\s>][\s\S]*?<\/h1>/i, `<h1>${h1Text}</h1>`);
  return out;
}

function qualityAndSeoPass(
  html: string,
  input: { businessName: string; niche: string; location: string }
) {
  const businessName = (input.businessName || "A professional business").trim();
  const niche = (input.niche || "services").trim();
  const location = (input.location || "").trim();

  const title = location
    ? `${businessName} | ${niche} in ${location}`
    : `${businessName} | ${niche}`;

  const descriptionBase = location
    ? `${businessName} provides ${niche} in ${location}.`
    : `${businessName} provides ${niche}.`;

  const description = `${descriptionBase} Get a fast quote, learn about our services, and contact us today.`;

  let out = ensureHeadBasics(html, { title, description });

  const h1Text = location
    ? `${businessName} — ${niche} in ${location}`
    : `${businessName} — ${niche}`;

  out = ensureSingleH1(out, h1Text);

  out = out.replace(/lorem ipsum/gi, "");

  if (!/contact/i.test(out)) {
    out = out + `\n<!-- Contact: Please add a contact section if missing -->\n`;
  }

  const textCheck = stripTags(out);
  if (textCheck.length < 200) {
    out =
      out +
      `\n<section><h2>Why choose ${businessName}?</h2><p>We focus on clear communication, reliable delivery, and quality results. Reach out today to discuss your needs and get a quick quote.</p></section>\n`;
  }

  return { html: out, seo: { title, description, h1: h1Text } };
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

  // Store HTML in BOTH places
  setProjectHtml(projectId, html);
  await kv.set(generatedProjectLatestKey(projectId), html);
  await kv.set("generated:latest", html);

  // Update project updatedAt
  await kv.set(projectKey(projectId), { ...project, updatedAt: nowIso() });

  setRunStatus(run.id, "complete");

  // NOTE:
  // We do NOT auto-call /publish from here because server-to-server fetch won't
  // include the user's Clerk session automatically, causing 401 Unauthorized.
  // Instead, the UI should call the publish endpoint separately after this finishes.

  return NextResponse.json({
    ok: true,
    projectId,
    runId: run.id,
    seo: refined.seo,
    readyToPublish: true,
    nextAction: "Call POST /api/projects/:projectId/publish from the UI after finish completes.",
  });
}
