import { NextResponse } from "next/server";
import { D8Storyboard, clampShotDurations } from "@/lib/video/d8VideoTypes";

export const runtime = "nodejs";

function fallbackStoryboard(topic: string): D8Storyboard {
  const brand = "Dominat8";
  const title = topic?.trim() ? topic.trim() : "How Dominat8 Works";
  const now = new Date().toISOString();

  const shots = clampShotDurations([
    { id: "s1", title: "Hook", durationSec: 5, lines: ["Build a site in minutes.", "Not weeks."] },
    { id: "s2", title: "Generate", durationSec: 7, lines: ["Describe your business.", "Dominat8 generates the first draft."] },
    { id: "s3", title: "Refine", durationSec: 7, lines: ["Tweak the copy.", "Swap sections.", "Keep control."] },
    { id: "s4", title: "SEO", durationSec: 7, lines: ["Sitemaps + metadata.", "Pages that can rank."] },
    { id: "s5", title: "Publish", durationSec: 6, lines: ["Connect your domain.", "Go live on Vercel."] },
    { id: "s6", title: "Close", durationSec: 5, lines: ["Dominat8.com", "Launch. Improve. Dominate."] },
  ]);

  return {
    brand,
    title,
    voiceover: [
      "Welcome to Dominat8.",
      "Tell us what you do, and we generate your site fast.",
      "Refine it in minutes, then publish with your own domain.",
      "Launch, iterate, and dominate your niche."
    ],
    shots,
    createdAtIso: now,
    mode: "fallback",
  };
}

function pickTextFromResponsesApi(json: any): string {
  // Best effort: Responses API returns output items; we extract any output_text blocks.
  try {
    const items = json?.output || [];
    let acc = "";
    for (const it of items) {
      const content = it?.content || [];
      for (const c of content) {
        if (c?.type === "output_text" && typeof c?.text === "string") acc += c.text;
      }
    }
    if (!acc && typeof json?.output_text === "string") acc = json.output_text;
    return (acc || "").trim();
  } catch {
    return "";
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const topic = String(body?.topic || "How Dominat8 Works");
    const seconds = Number(body?.seconds || 35);

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ ok: true, storyboard: fallbackStoryboard(topic), note: "OPENAI_API_KEY missing; fallback used." });
    }

    const prompt = `
You are generating a SHORT explainer storyboard as JSON only.

Constraints:
- Total runtime ~ ${seconds} seconds
- 5 to 8 shots
- Each shot has: id, title, durationSec (2-12), lines (1-3 lines)
- Optional voiceover: array of short sentences
- Brand is Dominat8
- Topic: ${topic}

Return ONLY valid JSON matching:
{
  "brand": "Dominat8",
  "title": string,
  "voiceover": string[],
  "shots": [{"id": string, "title": string, "durationSec": number, "lines": string[]}],
  "createdAtIso": string
}
`;

    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          {
            role: "user",
            content: [{ type: "input_text", text: prompt }],
          },
        ],
      }),
    });

    const json = await r.json().catch(() => ({}));

    if (!r.ok) {
      return NextResponse.json({
        ok: false,
        error: "OpenAI request failed",
        status: r.status,
        details: json,
        storyboard: fallbackStoryboard(topic),
      }, { status: 200 });
    }

    const text = pickTextFromResponsesApi(json);
    let parsed: any = null;
    try { parsed = JSON.parse(text); } catch { parsed = null; }

    if (!parsed?.shots || !Array.isArray(parsed.shots)) {
      return NextResponse.json({
        ok: true,
        storyboard: fallbackStoryboard(topic),
        note: "AI returned non-JSON or wrong shape; fallback used.",
        rawPreview: text.slice(0, 400),
      });
    }

    const storyboard: D8Storyboard = {
      brand: String(parsed.brand || "Dominat8"),
      title: String(parsed.title || topic),
      voiceover: Array.isArray(parsed.voiceover) ? parsed.voiceover.map((s: any) => String(s)) : undefined,
      shots: clampShotDurations(parsed.shots.map((s: any, i: number) => ({
        id: String(s.id || `s${i+1}`),
        title: String(s.title || `Shot ${i+1}`),
        durationSec: Number(s.durationSec || 6),
        lines: Array.isArray(s.lines) ? s.lines.map((x: any) => String(x)) : [String(s.lines || "")].filter(Boolean),
      }))),
      createdAtIso: new Date().toISOString(),
      mode: "ai",
    };

    return NextResponse.json({ ok: true, storyboard });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e), storyboard: fallbackStoryboard("How Dominat8 Works") }, { status: 200 });
  }
}