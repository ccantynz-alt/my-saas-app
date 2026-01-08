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

async function readJson(res: Response) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

export async function apiCreateProject(): Promise<CreateProjectResponse> {
  const res = await fetch("/api/projects", { method: "POST" });
  const json: any = await readJson(res);
  if (json?.ok) return { ok: true, projectId: json.projectId };
  return { ok: false, error: json?.error || `HTTP ${res.status}` };
}

export async function apiGenerate(projectId: string, prompt: string): Promise<GenerateResponse> {
  const res = await fetch(`/api/projects/${projectId}/generate`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  const json: any = await readJson(res);
  if (json?.ok) return { ok: true, runId: json.runId };
  return { ok: false, error: json?.error || `HTTP ${res.status}` };
}

export async function apiRunStatus(projectId: string, runId: string): Promise<RunStatusResponse> {
  const res = await fetch(`/api/projects/${projectId}/runs/${runId}`, { method: "GET" });
  const json: any = await readJson(res);
  if (json?.ok) return json as RunStatusResponse;
  return { ok: false, error: json?.error || `HTTP ${res.status}` };
}

export async function apiGetLatestHtml(projectId: string): Promise<HtmlResponse> {
  const res = await fetch(`/api/projects/${projectId}/html`, { method: "GET" });
  const json: any = await readJson(res);
  if (json?.ok) return { ok: true, html: json.html };
  return { ok: false, error: json?.error || `HTTP ${res.status}` };
}

export async function apiPublish(projectId: string): Promise<PublishResponse> {
  const res = await fetch(`/api/projects/${projectId}/publish`, { method: "POST" });
  const json: any = await readJson(res);
  if (json?.ok) return { ok: true, url: json.url };
  return { ok: false, error: json?.error || `HTTP ${res.status}` };
}
