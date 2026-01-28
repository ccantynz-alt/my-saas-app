import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { kvGetJson, kvSetJson } from "@/lib/d8kv";
import {
  marketingQueueKey,
  normalizeItem,
  nowIso,
  newId,
  normalizeChannel,
  MarketingItem,
} from "@/lib/admin/marketingQueue";

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

export async function GET(req: Request) {
  const gate = requireAdmin(req);
  if (!gate.ok) return NextResponse.json({ ok: false, error: gate.error }, { status: 200 });

  const url = new URL(req.url);
  const projectId = String(url.searchParams.get("projectId") || "demo").trim();
  const channel = String(url.searchParams.get("channel") || "").trim();

  let items = await loadQueue(projectId);
  if (channel) items = items.filter(x => x.channel === normalizeChannel(channel));

  return NextResponse.json({
    ok: true,
    projectId,
    count: items.length,
    items: items.sort((a,b) => (b.updatedAtIso || "").localeCompare(a.updatedAtIso || "")),
  });
}

export async function POST(req: Request) {
  const gate = requireAdmin(req);
  if (!gate.ok) return NextResponse.json({ ok: false, error: gate.error }, { status: 200 });

  const body = await req.json().catch(() => ({}));
  const projectId = String(body?.projectId || "demo").trim();
  const incoming = body?.items;

  if (!Array.isArray(incoming) || incoming.length < 1) {
    return NextResponse.json({ ok: false, error: "items[] required" }, { status: 200 });
  }

  const items = await loadQueue(projectId);
  const now = nowIso();

  for (const x of incoming) {
    const item = normalizeItem({
      id: newId("mq"),
      projectId,
      channel: x?.channel || "misc",
      type: x?.type || "copy",
      title: x?.title || "Untitled",
      body: x?.body || "",
      status: "draft",
      scheduledForIso: null,
      createdAtIso: now,
      updatedAtIso: now,
      source: x?.source,
    }, projectId);

    items.unshift(item);
  }

  await saveQueue(projectId, items);

  return NextResponse.json({ ok: true, projectId, added: incoming.length, count: items.length });
}