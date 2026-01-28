import { kvGetJson, kvSetJson } from "@/lib/d8kv";
import {
  MarketingItem,
  marketingQueueKey,
  marketingPublishedLogKey,
  normalizeItem,
  nowIso,
  toUtcEpochMs,
} from "@/lib/admin/marketingQueue";

export type SchedulerResult = {
  ok: true;
  projectId: string;
  nowIso: string;
  publishedIds: string[];
  publishedCount: number;
  scanned: number;
};

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

async function loadPublishedLog(projectId: string): Promise<any[]> {
  const v = await kvGetJson<any>(marketingPublishedLogKey(projectId));
  if (!v) return [];
  if (Array.isArray(v)) return v;
  if (Array.isArray(v?.items)) return v.items;
  return [];
}

async function savePublishedLog(projectId: string, items: any[]) {
  await kvSetJson(marketingPublishedLogKey(projectId), items);
}

export async function runMarketingScheduler(projectId: string): Promise<SchedulerResult> {
  const now = nowIso();
  const nowMs = Date.parse(now);

  const q = await loadQueue(projectId);
  const publishedIds: string[] = [];

  // publish due scheduled items
  const updated = q.map(it => {
    if (it.status !== "scheduled") return it;
    if (!it.scheduledForIso) return it;

    const dueMs = toUtcEpochMs(it.scheduledForIso);
    if (!Number.isFinite(dueMs)) return it;
    if (dueMs > nowMs) return it;

    const next = { ...it };
    next.status = "published";
    next.updatedAtIso = now;
    return next;
  });

  // figure which ids changed to published
  for (let i = 0; i < q.length; i++) {
    if (q[i].status !== "published" && updated[i].status === "published") {
      publishedIds.push(updated[i].id);
    }
  }

  if (publishedIds.length > 0) {
    await saveQueue(projectId, updated);

    // Append to published log (simple audit trail)
    const log = await loadPublishedLog(projectId);
    const additions = updated
      .filter(x => publishedIds.includes(x.id))
      .map(x => ({
        id: x.id,
        channel: x.channel,
        type: x.type,
        title: x.title,
        publishedAtIso: now,
        scheduledForIso: x.scheduledForIso || null,
      }));
    await savePublishedLog(projectId, additions.concat(log).slice(0, 2000));
  }

  return {
    ok: true,
    projectId,
    nowIso: now,
    publishedIds,
    publishedCount: publishedIds.length,
    scanned: q.length,
  };
}