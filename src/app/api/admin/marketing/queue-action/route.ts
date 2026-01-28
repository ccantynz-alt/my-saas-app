import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { kvGetJson, kvSetJson } from "@/lib/d8kv";
import { marketingQueueKey, normalizeItem, nowIso, MarketingItem, toUtcEpochMs } from "@/lib/admin/marketingQueue";

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

export async function POST(req: Request) {
  const gate = requireAdmin(req);
  if (!gate.ok) return NextResponse.json({ ok: false, error: gate.error }, { status: 200 });

  const body = await req.json().catch(() => ({}));
  const projectId = String(body?.projectId || "demo").trim();
  const id = String(body?.id || "").trim();
  const action = String(body?.action || "").trim(); // approve|publish|delete|revert|schedule|unschedule
  const scheduledForIso = body?.scheduledForIso ? String(body.scheduledForIso).trim() : "";

  if (!id) return NextResponse.json({ ok: false, error: "id required" }, { status: 200 });
  if (!action) return NextResponse.json({ ok: false, error: "action required" }, { status: 200 });

  const items = await loadQueue(projectId);
  const now = nowIso();

  const idx = items.findIndex(x => x.id === id);
  if (idx < 0) return NextResponse.json({ ok: false, error: "item not found" }, { status: 200 });

  if (action === "delete") {
    items.splice(idx, 1);
    await saveQueue(projectId, items);
    return NextResponse.json({ ok: true, projectId, deleted: id, count: items.length });
  }

  const it = items[idx];

  if (action === "approve") {
    it.status = "approved";
    it.scheduledForIso = null;
  } else if (action === "publish") {
    it.status = "published";
    // keep scheduledForIso as history
  } else if (action === "revert") {
    it.status = "draft";
    it.scheduledForIso = null;
  } else if (action === "schedule") {
    if (!scheduledForIso) return NextResponse.json({ ok: false, error: "scheduledForIso required" }, { status: 200 });
    const ms = toUtcEpochMs(scheduledForIso);
    if (!Number.isFinite(ms)) return NextResponse.json({ ok: false, error: "scheduledForIso invalid (must be ISO date)" }, { status: 200 });
    it.status = "scheduled";
    it.scheduledForIso = scheduledForIso;
  } else if (action === "unschedule") {
    it.status = "approved";
    it.scheduledForIso = null;
  } else {
    return NextResponse.json({ ok: false, error: "unknown action" }, { status: 200 });
  }

  it.updatedAtIso = now;
  items[idx] = it;

  await saveQueue(projectId, items);
  return NextResponse.json({ ok: true, projectId, id, status: it.status, scheduledForIso: it.scheduledForIso || null, count: items.length });
}