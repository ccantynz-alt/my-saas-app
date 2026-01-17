import type { NextApiRequest, NextApiResponse } from "next";
import { kv } from "../../../../../src/app/lib/kv";
import publishHandler from "../publish";

type Step = { at: string; name: string; ok: boolean; detail?: any };

function nowIso() {
  return new Date().toISOString();
}

function safeString(v: any, fallback: string) {
  return typeof v === "string" && v.trim().length > 0 ? v.trim() : fallback;
}

function buildMvpHtml(prompt: string) {
  const escaped = prompt.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  // MVP generator: deterministic HTML, mobile-first, inline CSS.
  // Later: swap this function to an LLM call; keep the interface the same.
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Generated Website</title>
  <style>
    :root { --border: rgba(0,0,0,.12); --muted: rgba(0,0,0,.72); }
    body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial; margin: 0; color: #111; background: #fff; }
    a { color: inherit; }
    .wrap { max-width: 980px; margin: 0 auto; padding: 40px 20px; }
    .hero { padding: 28px 22px; border: 1px solid var(--border); border-radius: 18px; }
    h1 { margin: 0 0 10px 0; font-size: 42px; letter-spacing: -0.02em; }
    p { margin: 0 0 12px 0; line-height: 1.6; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 18px; }
    .card { padding: 16px; border: 1px solid var(--border); border-radius: 14px; }
    .muted { opacity: .72; }
    .ctaRow { display:flex; flex-wrap:wrap; gap:10px; margin-top: 14px; }
    .btn { display:inline-flex; align-items:center; justify-content:center; padding: 10px 14px; border-radius: 999px; border: 1px solid var(--border); text-decoration:none; font-weight: 700; }
    .btnPrimary { background:#111; color:#fff; border-color:#111; }
    @media (max-width: 860px){ .grid { grid-template-columns: 1fr; } h1{font-size: 32px;} }
  </style>
</head>
<body>

<div style="padding:10px 16px;background:#111;color:white;font:700 13px system-ui;display:flex;gap:14px;flex-wrap:wrap;justify-content:center">
  <span>✅ Launch in minutes</span>
  <span>✅ Mobile-first</span>
  <span>✅ SEO-ready</span>
  <span>✅ Self-serve only</span>
</div>

<div class="wrap">
  <div class="hero">
    <h1>Your AI Website</h1>
    <p class="muted">Generated from your prompt:</p>
    <p><strong>${escaped}</strong></p>

    <p style="margin-top:12px; max-width: 70ch;">
      Website-only. No calls. No meetings. Users self-serve: generate → edit → publish in minutes.
    </p>

    <div class="ctaRow">
      <a class="btn btnPrimary" href="#generate">Generate my site</a>
      <a class="btn" href="#pricing">Start free</a>
    </div>
  </div>

  <div class="grid">
    <div class="card"><strong>What you get</strong><p class="muted">A clean, conversion-focused single-page site you can publish instantly.</p></div>
    <div class="card"><strong>Trust</strong><p class="muted">Clear pricing. Privacy-first. No pressure. No surprise calls.</p></div>
    <div class="card"><strong>Speed</strong><p class="muted">Generate → preview → publish. Done.</p></div>
  </div>

  <div id="pricing" style="margin-top:18px" class="card">
    <strong>Simple pricing</strong>
    <p class="muted">Start free. Upgrade only when you're ready to publish and scale.</p>
    <div style="display:grid;gap:12px;grid-template-columns:repeat(auto-fit,minmax(220px,1fr))">
      <div style="border:1px solid #eee;border-radius:16px;background:white;padding:16px">
        <div style="font-weight:900">Free</div>
        <div style="opacity:.85;margin-top:6">Generate + preview</div>
        <ul style="margin:10px 0 0;padding-left:18px;opacity:.9">
          <li>Create a site</li>
          <li>Preview instantly</li>
          <li>Basic quality check</li>
        </ul>
      </div>
      <div style="border:1px solid #b7ebc6;border-radius:16px;background:#f0fff4;padding:16px">
        <div style="font-weight:900">Pro</div>
        <div style="opacity:.85;margin-top:6">Publish + automation</div>
        <ul style="margin:10px 0 0;padding-left:18px;opacity:.9">
          <li>Publish your site</li>
          <li>Advanced SEO</li>
          <li>Automations</li>
        </ul>
      </div>
    </div>
    <div style="margin-top:14px;font:600 12px system-ui;opacity:.7">
      No fake scarcity. No misleading countdowns. Clear, honest messaging only.
    </div>
  </div>
</div>

<script>
  // Placeholder for future client-side enhancements (no external deps).
</script>

</body>
</html>`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const steps: Step[] = [];

  try {
    if (req.method !== "POST") {
      return res.status(405).json({ ok: false, error: "Method Not Allowed" });
    }

    const projectId = safeString(req.query.projectId, "");
    if (!projectId) {
      return res.status(400).json({ ok: false, error: "Missing projectId" });
    }

    const prompt = safeString(req.body?.prompt, "Create a premium conversion-focused business website. Self-serve only.");

    steps.push({ at: nowIso(), name: "generate-html", ok: true, detail: { promptChars: prompt.length } });
    const html = buildMvpHtml(prompt);

    const genKey = `generated:project:${projectId}:latest`;
    await kv.set(genKey, html);
    steps.push({ at: nowIso(), name: "kv-write-generated", ok: true, detail: { key: genKey, bytes: html.length } });

    // Call existing publish endpoint logic to write published HTML + publishedSpec keys.
    // We construct a minimal NextApiRequest/Response shim for re-use.
    const publishReq = {
      ...req,
      method: "POST",
      query: { projectId },
      body: {},
    } as any;

    let publishJson: any = null;
    const publishRes = {
      status(code: number) {
        (publishRes as any)._status = code;
        return publishRes;
      },
      json(payload: any) {
        publishJson = payload;
        return publishRes;
      },
      setHeader() {
        return publishRes;
      },
      end() {
        return publishRes;
      },
    } as any;

    await publishHandler(publishReq, publishRes);

    steps.push({ at: nowIso(), name: "publish", ok: true, detail: { status: (publishRes as any)._status ?? 200 } });

    return res.status(200).json({
      ok: true,
      projectId,
      nowIso: nowIso(),
      agent: "finish-for-me",
      publicUrl: publishJson?.publicUrl ?? `/p/${projectId}`,
      publishedAtIso: publishJson?.publishedAtIso ?? null,
      steps,
    });
  } catch (e: any) {
    steps.push({ at: nowIso(), name: "error", ok: false, detail: { message: e?.message ?? String(e) } });
    return res.status(500).json({ ok: false, error: "Internal Server Error", steps });
  }
}
