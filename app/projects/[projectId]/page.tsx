// app/projects/[projectId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Run = {
  id: string;
  status: string;
  createdAt?: string;
};

export default function ProjectPage({
  params,
}: {
  params: { projectId: string };
}) {
  const router = useRouter();
  const projectId = params.projectId;

  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [prompt, setPrompt] = useState(
`You are an elite SEO strategist + expert web designer.

Your task is to generate a COMPLETE, PRODUCTION-READY MULTI-PAGE WEBSITE with ADVANCED SEO OUTPUT.

IMPORTANT OUTPUT RULES (MUST FOLLOW EXACTLY):
1. You MUST output ONLY a JSON object (no markdown, no commentary).
2. The JSON MUST include:
   - "pages": object of { "/path": "<!doctype html>...full HTML document..." }
   - "pagesMeta": object of { "/path": { title, description, robots?, canonical?, ogImage?, schemaJsonLd? } }
3. Each "pages" value MUST be a FULL VALID HTML DOCUMENT (with <html>, <head>, <body>).
4. DO NOT output React/JSX/Next.js. HTML ONLY.
5. Inline CSS or <style> tags ONLY. No external assets.
6. Ensure the navigation links work between pages (use <a href="/about"> etc).

REQUIRED PAGES:
- "/"
- "/about"
- "/pricing"
- "/contact"

CONTENT REQUIREMENTS:
- Home: hero, benefits, trust signals, CTA
- About: mission, values, credibility, why choose us
- Pricing: 2–3 tiers (clear comparison)
- Contact: form (front-end only), phone/email, service area

ADVANCED SEO REQUIREMENTS:
A) Each page MUST include page-appropriate:
   - H1 (exactly one)
   - clean heading structure (H2/H3)
   - semantic sections
   - internal links between relevant pages
B) Each page MUST target a plausible keyword theme:
   - Home: primary keyword focus
   - About: brand + trust
   - Pricing: pricing intent keywords
   - Contact: contact intent keywords
C) In pagesMeta:
   - title: 45–60 chars, high intent, includes keyword
   - description: 140–160 chars, compelling, includes keyword + CTA
   - robots: default to "index,follow" unless explicitly needed otherwise

FAQ SCHEMA (RICH RESULTS):
- In pagesMeta["/"], include schemaJsonLd for an FAQPage with 6–10 FAQs.
- Questions should be specific, high-intent, and relevant to the website’s topic.
- Answers should be concise, helpful, non-spammy.

FAQ schema format example:
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Question text?",
      "acceptedAnswer": { "@type": "Answer", "text": "Answer text." }
    }
  ]
}

OUTPUT JSON SHAPE (EXACT KEYS REQUIRED):
{
  "pages": {
    "/": "<!doctype html><html>...</html>",
    "/about": "<!doctype html><html>...</html>",
    "/pricing": "<!doctype html><html>...</html>",
    "/contact": "<!doctype html><html>...</html>"
  },
  "pagesMeta": {
    "/": {
      "title": "…",
      "description": "…",
      "robots": "index,follow",
      "schemaJsonLd": { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [ ... ] }
    },
    "/about": { "title": "…", "description": "…", "robots": "index,follow" },
    "/pricing": { "title": "…", "description": "…", "robots": "index,follow" },
    "/contact": { "title": "…", "description": "…", "robots": "index,follow" }
  }
}

NOW GENERATE THE WEBSITE TOPIC:
Create a modern, premium service business website (professional, conversion-focused).
Make it feel real, trustworthy, and high quality.

Return ONLY the JSON.
`
  );

  async function loadRuns() {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`/api/projects/${projectId}/runs`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (!data?.ok) throw new Error(data?.error || "Failed to load runs");
      setRuns(Array.isArray(data.runs) ? data.runs : []);
    } catch (e: any) {
      setErr(e?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  async function createRun() {
    setErr(null);
    try {
      const res = await fetch(`/api/projects/${projectId}/runs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Failed to create run");
      }
      await loadRuns();
    } catch (e: any) {
      setErr(e?.message || "Failed to create run");
    }
  }

  useEffect(() => {
    loadRuns();
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <div style={{ marginBottom: 16 }}>
        <Link href="/projects">← Back to Projects</Link>
        <h1 style={{ fontSize: 28, fontWeight: 900, marginTop: 8 }}>
          Project {projectId}
        </h1>
      </div>

      <div
        style={{
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 16,
          padding: 16,
          marginBottom: 20,
        }}
      >
        <h2 style={{ marginTop: 0 }}>Generate Website</h2>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={24}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "transparent",
            fontFamily: "ui-monospace, monospace",
            fontSize: 13,
          }}
        />
        <div style={{ marginTop: 10 }}>
          <button
            onClick={createRun}
            style={{
              padding: "10px 14px",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.12)",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Run Generator
          </button>
        </div>
      </div>

      <div>
        <h2>Runs</h2>
        {loading ? (
          <div>Loading…</div>
        ) : err ? (
          <div style={{ color: "red" }}>{err}</div>
        ) : runs.length === 0 ? (
          <div>No runs yet.</div>
        ) : (
          <ul>
            {runs.map((r) => (
              <li key={r.id}>
                <Link href={`/projects/${projectId}/runs/${r.id}`}>
                  {r.id} — {r.status}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
