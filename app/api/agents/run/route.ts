// app/api/agents/run/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Change this string any time you paste a new file so we can confirm deployment.
const VERSION = "agents-run-v4-NO_STARTSWITH";

const RunRequestSchema = z.object({
  projectId: z.string().min(1),
  prompt: z.string().min(1),
});

function uid(prefix = "") {
  const rnd = Math.random().toString(16).slice(2);
  const ts = Date.now().toString(16);
  return prefix ? `${prefix}_${ts}${rnd}` : `${ts}${rnd}`;
}

function runKey(userId: string, runId: string) {
  return `runs:${userId}:${runId}`;
}

// No startsWith usage anywhere:
function hasPrefix(value: unknown, prefix: string) {
  if (typeof value !== "string") return false;
  return value.slice(0, prefix.length) === prefix;
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    version: VERSION,
    message: "Agent endpoint is online. POST JSON { projectId, prompt }",
    example: {
      projectId: "proj_test",
      prompt: "Create app/generated/page.tsx with a hero headline and button",
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    const parsedReq = RunRequestSchema.safeParse(body);
    if (!parsedReq.success) {
      return NextResponse.json(
        { ok: false, version: VERSION, error: "Invalid request body", issues: parsedReq.error.issues },
        { status: 400 }
      );
    }

    const { projectId, prompt } = parsedReq.data;

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { ok: false, version: VERSION, error: "Missing OPENAI_API_KEY" },
        { status: 500 }
      );
    }

    // Dynamic imports so Next build step can't execute code at build-time
    const [{ default: OpenAI }, kvMod, authMod] = await Promise.all([
      import("openai"),
      import("../../../lib/kv"),
      import("../../../lib/demoAuth"),
    ]);

    const { kvJsonSet, kvNowISO } = kvMod as any;
    const { getCurrentUserId } = authMod as any;

    const client = new OpenAI({ apiKey });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            'Return JSON ONLY in this exact shape: {"files":[{"path":"app/generated/...","content":"..."}]}',
        },
        { role: "user", content: prompt },
      ],
    });

    const raw = completion.choices?.[0]?.message?.content ?? "";
    let parsed: any;

    try {
      parsed = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        { ok: false, version: VERSION, error: "Model returned invalid JSON", raw: raw.slice(0, 2000) },
        { status: 500 }
      );
    }

    const filesRaw = Array.isArray(parsed?.files) ? parsed.files : [];

    // Sanitize aggressively (no startsWith used)
    const cleaned = filesRaw
      .filter((f: any) => f && typeof f === "object")
      .map((f: any) => ({
        path: typeof f.path === "string" ? f.path : "",
        content: typeof f.content === "string" ? f.content : "",
      }))
      .filter((f: any) => hasPrefix(f.path, "app/generated/") && f.content.length > 0);

    if (cleaned.length === 0) {
      return NextResponse.json(
        { ok: false, version: VERSION, error: "Agent returned no valid files", raw: parsed },
        { status: 400 }
      );
    }

    const userId =
      (typeof getCurrentUserId === "function" && getCurrentUserId()) || "demo";

    const runId = uid("run");

    await kvJsonSet(runKey(userId, runId), {
      runId,
      projectId,
      prompt,
      createdAt: kvNowISO(),
      files: cleaned,
    });

    return NextResponse.json({
      ok: true,
      version: VERSION,
      runId,
      filesCount: cleaned.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, version: VERSION, error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
