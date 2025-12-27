import { NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "crypto";
import OpenAI from "openai";
import { kvJsonGet, kvJsonSet, kvNowISO } from "../../../lib/kv";
import { getCurrentUserId } from "../../../lib/demoAuth";

const FileSchema = z.object({
  path: z.string().min(1),
  content: z.string(),
});
const AgentResponseSchema = z.object({
  files: z.array(FileSchema).min(1),
});

function uid(prefix = "") {
  const id = randomUUID().replace(/-/g, "");
  return prefix ? `${prefix}_${id}` : id;
}

function runKey(userId: string, runId: string) {
  return `runs:${userId}:${runId}`;
}
function runFilesKey(userId: string, runId: string) {
  return `runfiles:${userId}:${runId}`;
}
function runLogsKey(userId: string, runId: string) {
  return `runlogs:${userId}:${runId}`;
}
function runsIndexKey(userId: string, projectId: string) {
  return `runs:index:${userId}:${projectId}`;
}

function safePath(p: string) {
  if (!p.startsWith("app/generated/")) return false;
  if (p.includes("..")) return false;
  return true;
}

export async function POST(req: Request) {
  const userId = getCurrentUserId();
  const body = await req.json().catch(() => ({}));

  const projectId = String(body.projectId || "");
  const prompt = String(body.prompt || "").trim();

  if (!projectId) return NextResponse.json({ ok: false, error: "Missing projectId" }, { status: 400 });
  if (!prompt) return NextResponse.json({ ok: false, error: "Missing prompt" }, { status: 400 });

  const runId = uid("run");
  const createdAt = kvNowISO();

  // Create run record early
  await kvJsonSet(runKey(userId, runId), {
    id: runId,
    projectId,
    status: "running",
    createdAt,
    updatedAt: createdAt,
    prompt,
  });

  // Add to runs index
  const idx = (await kvJsonGet<string[]>(runsIndexKey(userId, projectId))) || [];
  await kvJsonSet(runsIndexKey(userId, projectId), [runId, ...idx]);

  // Init logs
  await kvJsonSet(runLogsKey(userId, runId), [`[${createdAt}] Run created`]);

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const system = `
You are an in-app code generation agent.
Return ONLY strict JSON (no markdown).
You may ONLY create files under "app/generated/".
Return format:
{ "files": [ { "path": "app/generated/...", "content": "..." } ] }
`.trim();

    const user = `
ProjectId: ${projectId}
User request:
${prompt}
`.trim();

    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.2,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      response_format: { type: "json_object" },
    });

    const text = completion.choices[0]?.message?.content || "";
    const parsed = AgentResponseSchema.parse(JSON.parse(text));

    // Safety: enforce paths
    const bad = parsed.files.find((f) => !safePath(f.path));
    if (bad) throw new Error(`Unsafe path rejected: ${bad.path}`);

    await kvJsonSet(runFilesKey(userId, runId), parsed.files);

    const doneAt = kvNowISO();
    await kvJsonSet(runKey(userId, runId), {
      id: runId,
      projectId,
      status: "completed",
      createdAt,
      updatedAt: doneAt,
      prompt,
      fileCount: parsed.files.length,
    });

    await kvJsonSet(runLogsKey(userId, runId), [
      ...(await kvJsonGet<string[]>(runLogsKey(userId, runId)))!,
      `[${doneAt}] Generated ${parsed.files.length} files`,
    ]);

    return NextResponse.json({ ok: true, runId });
  } catch (err: any) {
    const failedAt = kvNowISO();
    await kvJsonSet(runKey(userId, runId), {
      ...(await kvJsonGet<any>(runKey(userId, runId))),
      status: "failed",
      updatedAt: failedAt,
      error: String(err?.message || err),
    });
    await kvJsonSet(runLogsKey(userId, runId), [
      ...(await kvJsonGet<string[]>(runLogsKey(userId, runId)))!,
      `[${failedAt}] ERROR: ${String(err?.message || err)}`,
    ]);
    return NextResponse.json({ ok: false, error: String(err?.message || err), runId }, { status: 500 });
  }
}
