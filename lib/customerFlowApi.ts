// lib/customerFlowApi.ts
export type CreateProjectResponse = { ok: boolean; projectId?: string; error?: string };
export type GenerateResponse = { ok: boolean; runId?: string; error?: string };
export type RunStatusResponse = {
  ok: boolean;
  run?: { id: string; status: "queued" | "running" | "complete" | "error"; error?: string };
  error?: string;
};
export type PublishResponse = { ok: boolean; url?: string; error?: string };
export type HtmlResponse = { ok: boolean; html?: string; error?: string };

// IMPORTANT:
// These endpoints are guesses based on your previous logs.
// In Step 6 below I show you how to confirm the real paths in your repo quickly.
export async function apiCreateProject(): Promise<CreateProjectResponse> {
  const res = await fetch("/api/projects", { method: "POST" });
  return res.json();
}

export async function apiGenerate(projectId: string, prompt: string): Promise<GenerateResponse> {
  const res = await fetch(`/api/projects/${projectId}/generate`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  return res.json();
}

export async function apiRunStatus(projectId: string, runId: string): Promise<RunStatusResponse> {
  const res = await fetch(`/api/projects/${projectId}/runs/${runId}`, { method: "GET" });
  return res.json();
}

export async function apiGetLatestHtml(projectId: string): Promise<HtmlResponse> {
  const res = await fetch(`/api/projects/${projectId}/html`, { method: "GET" });
  return res.json();
}

export async function apiPublish(projectId: string): Promise<PublishResponse> {
  // This one we KNOW you have from earlier: /api/projects/:projectId/publish
  const res = await fetch(`/api/projects/${projectId}/publish`, { method: "POST" });
  return res.json();
}
