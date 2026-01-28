import { NextResponse } from "next/server";
import { requireAdmin, safeOrigin } from "@/lib/admin/auth";
import { kvGetJson, kvSetJson } from "@/lib/d8kv";
import { marketingQueueKey, normalizeItem, nowIso, newId, MarketingItem } from "@/lib/admin/marketingQueue";

export const runtime = "nodejs";

async function loadQueue(projectId: string): Promise<MarketingItem[]> {
  const v = await kvGetJson<any>(marketingQueueKey(projectId));
  if (!v) return [];
  if (Array.isArray(v)) return v.map(x => normalizeItem(x, projectId));
  if (Array.isArray(v?.items)) return v.items.map((x: any) => normalizeItem(x, projectId));
  return [];
}

async function saveQueue(projectId: string, items: MarketingItem[]) {
  await kvSetJson(marketingQueueKey(projectId), items);
}

function extractText(resp: any): string {
  if (typeof resp?.output_text === "string") return resp.output_text;
  if (typeof resp?.text === "string") return resp.text;
  if (typeof resp?.result === "string") return resp.result;
  if (typeof resp === "string") return resp;
  try { return JSON.stringify(resp, null, 2); } catch { return String(resp); }
}

export async function POST(req: Request) {
  const gate = requireAdmin(req);
  if (!gate.ok) return NextResponse.json({ ok: false, error: gate.error }, { status: 200 });

  const body = await req.json().catch(() => ({}));
  const projectId = String(body?.projectId || "demo").trim();
  const topic = String(body?.topic || "Polish Dominat8 marketing and propose improvements").trim();

  const origin = safeOrigin(req);
  const headers: Record<string,string> = {
    "Content-Type": "application/json",
    "x-admin-token": req.headers.get("x-admin-token") || "",
    "authorization": req.headers.get("authorization") || "",
  };

  const now = nowIso();
  const items = await loadQueue(projectId);

  const agents = [
    { id: "02_creative_director", channel: "landing", type: "copy", title: "Landing / Homepage copy improvements" },
    { id: "03_seo",             channel: "seo",     type: "meta", title: "SEO titles/descriptions/keywords" },
    { id: "01_dispatcher",      channel: "plan",    type: "plan", title: "Weekly marketing plan (queue + schedule ideas)" },
  ];

  const created: MarketingItem[] = [];

  for (const a of agents) {
    const r = await fetch(`${origin}/api/agents/run`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        projectId,
        agentId: a.id,
        instruction: `${topic}\n\nOutput structured headings + bullet points. Keep actionable. Do not change customer-facing UI without explicit request.`,
        runId: `mqgen_${Date.now().toString(36)}_${a.id}`,
        mode: "real-run",
      }),
      cache: "no-store",
    });

    const j = await r.json().catch(() => ({}));
    const text = extractText(j);

    const item = normalizeItem({
      id: newId("mq"),
      projectId,
      channel: a.channel,
      type: a.type,
      title: a.title,
      body: text,
      status: "draft",
      scheduledForIso: null,
      createdAtIso: now,
      updatedAtIso: now,
      source: { agentId: a.id, runId: String(j?.runId || "") },
    }, projectId);

    items.unshift(item);
    created.push(item);
  }

  await saveQueue(projectId, items);

  return NextResponse.json({ ok: true, projectId, created: created.length, ids: created.map(x => x.id) });
}