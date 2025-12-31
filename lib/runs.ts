// lib/runs.ts
import { kv, kvJsonGet, kvJsonSet, kvNowISO } from "@/app/lib/kv";
import { randomUUID } from "crypto";

/**
 * Runs = background jobs.
 * Stored as JSON in KV.
 *
 * This file only uses KV methods your wrapper exposes:
 * - kv.sadd / kv.smembers
 * - kvJsonGet / kvJsonSet
 */

export type RunStatus = "queued" | "running" | "done" | "failed";

export type AgentPersona = "general" | "planner" | "coder" | "reviewer" | "researcher";

export type Run = {
  id: string;
  prompt: string;
  status: RunStatus;

  // persona
  agent: AgentPersona;

  // optional attachments
  projectId?: string;
  threadId?: string;

  createdAt: string;
  startedAt?: string;
  finishedAt?: string;

  error?: string;
};

export type RunLog = {
  ts: string;
  level: "info" | "warn" | "error";
  message: string;
};

function uid(prefix: string) {
  return `${prefix}_${randomUUID().replace(/-/g, "")}`;
}

function nowISO() {
  return kvNowISO ? kvNowISO() : new Date().toISOString();
}

function runKey(runId: string) {
  return `runs:${runId}`;
}

function runLogsKey(runId: string) {
  return `runs:${runId}:logs`;
}

// Indexes (SETS, not lists)
function projectRunsIndexKey(projectId: string) {
  return `projects:${projectId}:runs`;
}

function threadRunsIndexKey(threadId: string) {
  return `threads:${threadId}:runs`;
}

// A SET of run IDs that have ever been queued.
// We can't remove members (no srem in wrapper), so cron re-checks status.
function queuedRunsKey() {
  return `runs:index:queued`;
}

function personaSystemPrompt(agent: AgentPersona) {
  switch (agent) {
    case "planner":
      return [
        "You are a planning agent.",
        "Goal: turn the user’s request into a clear step-by-step plan.",
        "Output format:",
        "1) Goal",
        "2) Assumptions",
        "3) Steps (numbered)",
        "4) Risks / unknowns",
        "Be concise and practical.",
      ].join("\n");
    case "coder":
      return [
        "You are a senior software engineer agent.",
        "Goal: produce correct, copy/paste-ready code with minimal commentary.",
        "Prefer complete files over diffs when possible.",
        "If requirements are missing, make reasonable assumptions and state them briefly.",
      ].join("\n");
    case "reviewer":
      return [
        "You are a strict code/reasoning reviewer agent.",
        "Goal: find issues, edge cases, security risks, and propose improvements.",
        "Output format: Findings (bullets) + Recommended changes (bullets).",
        "Be specific and actionable.",
      ].join("\n");
    case "researcher":
      return [
        "You are a research agent.",
        "Goal: synthesize a structured answer, highlight tradeoffs, and propose next actions.",
        "If you lack data, say what you would look up and why (don’t invent facts).",
      ].join("\n");
    case "general":
    default:
      return [
        "You are the background agent for this platform.",
        "Be helpful, concise, and action-oriented.",
      ].join("\n");
  }
}

/** Create a new run (queued). */
export async function createRun(input: {
  prompt: string;
  agent?: AgentPersona;
  projectId?: string;
  threadId?: string;
}): Promise<Run> {
  const id = uid("run");

  const run: Run = {
    id,
    prompt: input.prompt,
    agent: input.agent ?? "general",
    projectId: input.projectId,
    threadId: input.threadId,
    status: "queued",
    createdAt: nowISO(),
  };

  // store run object
  await kvJsonSet(runKey(id), run);

  // initialize logs to empty array
  await kvJsonSet(runLogsKey(id), []);

  // add to indexes
  await kv.sadd(queuedRunsKey(), id);
  if (input.projectId) await kv.sadd(projectRunsIndexKey(input.projectId), id);
  if (input.threadId) await kv.sadd(threadRunsIndexKey(input.threadId), id);

  await appendRunLog(id, "info", `Run created (queued). agent=${run.agent}`);
  return run;
}

/** Get a run by id (or null). */
export async function getRun(runId: string): Promise<Run | null> {
  const run = await kvJsonGet<Run>(runKey(runId));
  return run && typeof run === "object" ? run : null;
}

/** Overwrite a run object. */
async function saveRun(run: Run) {
  await kvJsonSet(runKey(run.id), run);
}

export async function getRunLogs(runId: string): Promise<RunLog[]> {
  const logs = await kvJsonGet<RunLog[]>(runLogsKey(runId));
  return Array.isArray(logs) ? logs : [];
}

export async function appendRunLog(
  runId: string,
  level: RunLog["level"],
  message: string
) {
  const logs = await getRunLogs(runId);
  logs.push({ ts: nowISO(), level, message });
  await kvJsonSet(runLogsKey(runId), logs);
}

/** List run IDs for a project (SET membership). */
export async function listProjectRunIds(projectId: string): Promise<string[]> {
  const ids = await kv.smembers(projectRunsIndexKey(projectId));
  return Array.isArray(ids) ? ids : [];
}

/** List run IDs for a thread (SET membership). */
export async function listThreadRunIds(threadId: string): Promise<string[]> {
  const ids = await kv.smembers(threadRunsIndexKey(threadId));
  return Array.isArray(ids) ? ids : [];
}

/** Load runs for a project (best-effort; missing runs are skipped). */
export async function listProjectRuns(projectId: string): Promise<Run[]> {
  const ids = await listProjectRunIds(projectId);
  const runs: Run[] = [];
  for (const id of ids) {
    const r = await getRun(id);
    if (r) runs.push(r);
  }
  runs.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return runs;
}

/** Load runs for a thread (best-effort; missing runs are skipped). */
export async function listThreadRuns(threadId: string): Promise<Run[]> {
  const ids = await listThreadRunIds(threadId);
  const runs: Run[] = [];
  for (const id of ids) {
    const r = await getRun(id);
    if (r) runs.push(r);
  }
  runs.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return runs;
}

/** Mark run running. */
async function markRunning(run: Run) {
  run.status = "running";
  run.startedAt = nowISO();
  run.error = undefined;
  await saveRun(run);
}

/** Mark run done. */
async function markDone(run: Run) {
  run.status = "done";
  run.finishedAt = nowISO();
  await saveRun(run);
}

/** Mark run failed. */
async function markFailed(run: Run, err: unknown) {
  run.status = "failed";
  run.finishedAt = nowISO();
  run.error = err instanceof Error ? err.message : String(err);
  await saveRun(run);
}

/**
 * Execute a run.
 * This assumes you already implemented the OpenAI + thread writeback pieces.
 */
export async function executeRun(runId: string) {
  const run = await getRun(runId);
  if (!run) return;
  if (run.status !== "queued") return;

  await markRunning(run);
  await appendRunLog(runId, "info", `Execution started. agent=${run.agent}`);

  try {
    if (!run.threadId) {
      await appendRunLog(runId, "warn", "No threadId attached; nothing to read/write.");
      await markDone(run);
      return;
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("Missing OPENAI_API_KEY env var");

    const { getThreadMessages, appendThreadMessage } = await import("@/app/lib/threadStore");
    const { callOpenAIChat } = await import("@/app/lib/openai");

    const threadMessages = await getThreadMessages(run.threadId);

    const system = personaSystemPrompt(run.agent);

    const messages = [
      { role: "system" as const, content: system },
      ...threadMessages.map((m: any) => ({
        role: m.role as "user" | "assistant" | "system",
        content: m.content,
      })),
      { role: "user" as const, content: run.prompt },
    ];

    await appendRunLog(runId, "info", `Calling OpenAI (${run.agent}) with ${messages.length} messages...`);
    const reply = await callOpenAIChat({ apiKey, messages });

    await appendRunLog(runId, "info", "Writing assistant reply back into thread...");
    await appendThreadMessage(run.threadId, { role: "assistant", content: reply });

    await markDone(run);
    await appendRunLog(runId, "info", "Execution finished (done).");
  } catch (e) {
    await appendRunLog(runId, "error", "Execution failed.");
    await markFailed(run, e);
  }
}

/**
 * Cron tick: process queued runs.
 * Because the KV wrapper doesn't expose srem/del/lpush, we:
 * - keep a set of "ever queued" IDs
 * - on each tick, check the run status and only run those still queued
 */
export async function tickQueuedRuns(opts?: { limit?: number }) {
  const limit = opts?.limit ?? 3;

  const ids = await kv.smembers(queuedRunsKey());
  if (!Array.isArray(ids) || ids.length === 0) {
    return { ok: true, processed: 0 };
  }

  let processed = 0;
  for (const id of ids) {
    if (processed >= limit) break;

    const r = await getRun(id);
    if (!r) continue;
    if (r.status !== "queued") continue;

    await executeRun(id);
    processed++;
  }

  return { ok: true, processed };
}
