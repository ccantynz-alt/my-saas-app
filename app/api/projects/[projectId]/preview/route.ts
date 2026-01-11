import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { kv } from "@vercel/kv";

export const runtime = "nodejs";

function isKvConfigured() {
  const env = process.env as any;
  return Boolean(env.KV_REST_API_URL || env.VERCEL_KV_REST_API_URL || env.KV_URL || env.VERCEL_KV_URL);
}

function devStore() {
  const g = globalThis as any;
  g.__devProjects = g.__devProjects ?? new Map<string, any>();
  g.__devHtml = g.__devHtml ?? new Map<string, string>();
  return {
    projects: g.__devProjects as Map<string, any>,
    html: g.__devHtml as Map<string, string>,
  };
}

function projectKey(projectId: string) {
  return "project:" + projectId;
}
function htmlKey(projectId: string) {
  return "generated:project:" + projectId + ":latest";
}

async function kv_hgetall(key: string) {
  if (isKvConfigured()) return (await kv.hgetall(key)) as any;
  const ds = devStore();
  return ds.projects.get(key) ?? null;
}
async function kv_hset(key: string, obj: any) {
  if (isKvConfigured()) return kv.hset(key, obj);
  const ds = devStore();
  ds.projects.set(key, obj);
}
async function kv_set(key: string, value: string) {
  if (isKvConfigured()) return kv.set(key, value);
  const ds = devStore();
  ds.html.set(key, value);
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildBootstrapHtml(input: {
  title: string;
  tagline: string;
  services: string[];
  bullets: string[];
  cta: string;
  contactEmail: string;
}) {
  const title = escapeHtml(input.title);
  const tagline = escapeHtml(input.tagline);
  const cta = escapeHtml(input.cta);
  const contactEmail = escapeHtml(input.contactEmail);

  const servicesHtml = input.services
    .map((s) => '<li class="card">' + escapeHtml(s) + "</li>")
    .join("");

  const bulletsHtml = input.bullets
    .map((b) => "<li>" + escapeHtml(b) + "</li>")
    .join("");

  const year = String(new Date().getFullYear());

  const lines = [
    "<!doctype html>",
    '<html lang="en">',
    "<head>",
    '<meta charset="utf-8" />',
    '<meta name="viewport" content="width=device-width, initial-scale=1" />',
    "<title>" + title + "</title>",
    "<style>",
    ":root{--bg:#0b0f17;--card:#111827;--text:#e5e7eb;--muted:#9ca3af;--line:#1f2937;--brand:#7c3aed;}",
    "body{margin:0;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;background:linear-gradient(180deg,#070a12,#0b0f17);color:var(--text);}",
    ".wrap{max-width:980px;margin:0 auto;padding:48px 20px;}",
    ".nav{display:flex;justify-content:space-between;align-items:center;padding:14px 0;border-bottom:1px solid var(--line);}",
    ".brand{font-weight:700;letter-spacing:.2px;}",
    ".pill{font-size:12px;color:var(--muted);border:1px solid var(--line);padding:6px 10px;border-radius:999px;}",
    ".hero{padding:44px 0 10px;}",
    "h1{font-size:40px;line-height:1.05;margin:0;}",
    ".tag{margin-top:12px;font-size:16px;color:var(--muted);max-width:62ch;}",
    ".ctaRow{margin-top:18px;display:flex;gap:12px;flex-wrap:wrap;}",
    ".btn{background:var(--brand);border:none;color:white;padding:12px 16px;border-radius:14px;font-weight:600;cursor:pointer;text-decoration:none;display:inline-block;}",
    ".btn2{background:transparent;border:1px solid var(--line);color:var(--text);}",
    ".grid{display:grid;grid-template-columns:repeat(12,1fr);gap:14px;margin-top:26px;}",
    ".panel{grid-column:span 12;border:1px solid var(--line);background:rgba(17,24,39,.65);border-radius:18px;padding:18px;}",
    "@media(min-width:860px){.panel.left{grid-column:span 7;}.panel.right{grid-column:span 5;}h1{font-size:52px;}}",
    ".cards{list-style:none;padding:0;margin:0;display:grid;gap:10px;}",
    ".card{padding:12px 12px;border-radius:14px;border:1px solid var(--line);background:rgba(0,0,0,.15);}",
    ".muted{color:var(--muted);}",
    ".kicker{font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);}",
    "ul.bullets{margin:10px 0 0;padding-left:18px;color:var(--text);}",
    "footer{margin-top:34px;padding-top:18px;border-top:1px solid var(--line);color:var(--muted);font-size:13px;}",
    ".note{font-size:13px;color:var(--muted);}",
    ".email{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono;}",
    "</style>",
    "</head>",
    "<body>",
    '<div class="wrap">',
    '<div class="nav"><div class="brand">' + title + '</div><div class="pill">Generated preview</div></div>',
    '<section class="hero">',
    '<div class="kicker">Automation-first  Premium  Ethical</div>',
    "<h1>" + tagline + "</h1>",
    '<p class="tag">A clean, conversion-ready layout you can publish instantly. No calls, no meetings  just results.</p>',
    '<div class="ctaRow"><a class="btn" href="#contact">' + cta + '</a><a class="btn btn2" href="#services">See services</a></div>',
    '<p class="note">This is a BOOTSTRAP preview. You can customize later.</p>',
    "</section>",
    '<section class="grid">',
    '<div class="panel left" id="services"><div class="kicker">Services</div><h2 style="margin:8px 0 10px;">What we do</h2><ul class="cards">' + servicesHtml + "</ul></div>",
    '<div class="panel right"><div class="kicker">Why us</div><h2 style="margin:8px 0 10px;">Fast, simple, global</h2><div class="muted">Designed for automated onboarding and self-serve conversion.</div><ul class="bullets">' + bulletsHtml + "</ul></div>",
    '<div class="panel" id="contact"><div class="kicker">Contact</div><h2 style="margin:8px 0 10px;">Get started</h2><div class="muted">Email us and well respond with a next-step link.</div><p class="email">' + contactEmail + "</p></div>",
    "</section>",
    "<footer><div> " + year + " " + title + ". Built with BOOTSTRAP.</div></footer>",
    "</div>",
    "</body>",
    "</html>",
  ];

  return lines.join("\n");
}

export async function POST(req: Request, ctx: { params: { projectId: string } }) {
  try {
    const a = await auth();
    const userId = a.userId;
    if (!userId) {
      return NextResponse.json({ ok: false, error: "Unauthenticated" }, { status: 401 });
    }

    const projectId = ctx?.params?.projectId;
    if (!projectId) {
      return NextResponse.json({ ok: false, error: "Missing projectId" }, { status: 400 });
    }

    const project = (await kv_hgetall(projectKey(projectId))) as any;
    if (!project || !project.id) {
      return NextResponse.json({ ok: false, error: "Project not found" }, { status: 404 });
    }

    if (project.clerkUserId && project.clerkUserId !== userId) {
      return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
    }

    const html = buildBootstrapHtml({
      title: "Your Business",
      tagline: "Premium websites that convert  built automatically.",
      services: ["High-converting landing page", "Services + proof sections", "SEO-ready structure", "Fast publish flow"],
      bullets: ["No meetings required", "Self-serve onboarding", "Fast iteration", "Conversion-first layout"],
      cta: "Request a quote",
      contactEmail: "hello@example.com",
    });

    await kv_set(htmlKey(projectId), html);
    await kv_hset(projectKey(projectId), { ...project, updatedAt: new Date().toISOString(), hasHtml: "true" });

    return NextResponse.json({ ok: true, projectId, hasHtml: true, storage: isKvConfigured() ? "kv" : "dev-memory" });
  } catch (e: any) {
    console.error("POST /preview crashed:", e);
    return NextResponse.json({ ok: false, error: "Server error", message: String(e?.message ?? e) }, { status: 500 });
  }
}