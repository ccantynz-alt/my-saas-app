// app/api/agents/run/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "Agent endpoint is online. POST JSON { projectId, prompt }",
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    const parsedReq = RunRequestSchema.safeParse(body);
    if (!parsedReq.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid request body", issues: parsedReq.error.issues },
        { status: 400 }
      );
    }

    const { projectId, prompt } = parsedReq.data;

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { ok: false, error: "Missing OPENAI_API_KEY" },
        { status: 500 }
      );
    }

    // Dynamic imports (prevents build-time crashes)
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
            'Return JSON ONLY in this shape: {"files":[{"path":"app/generated/...","content":"..."}]}',
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
        { ok: false, error: "Model returned invalid JSON", raw },
        { status: 500 }
      );
    }

    const filesRaw = Array.isArray(parsed?.files) ? parsed.files : [];

    // 🔒 HARD SANITIZATION (THIS FIXES YOUR BUG)
    const files = filesRaw
      .filter((f: any) => f && typeof f === "object")
      .map((f: any) => ({
        path: typeof f.path === "string" ? f.path : "",
        content: typeof f.content === "string" ? f.content : "",
      }))
      .filter(
        (f: any) =>
          f.path.startsWith("app/generated/") && f.content.length > 0
      );

    if (files.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Agent returned no valid files",
          raw: parsed,
        },
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
      files,
    });

    return NextResponse.json({
      ok: true,
      runId,
      filesCount: files.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
