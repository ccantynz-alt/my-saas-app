export type MarketingStatus = "draft" | "approved" | "scheduled" | "published";

// Channel controls how items are grouped and scheduled.
export type MarketingChannel = "landing" | "seo" | "blog" | "social" | "email" | "plan" | "misc";

export type MarketingItem = {
  id: string;
  projectId: string;

  channel: MarketingChannel; // landing/seo/blog/social/email/plan/misc
  type: string;             // freeform sub-type (e.g. "homepage-hero", "meta", "thread", "newsletter")

  title: string;
  body: string; // markdown/text

  status: MarketingStatus;

  // If scheduled, the scheduler will publish when this time is reached (UTC ISO).
  scheduledForIso?: string | null;

  createdAtIso: string;
  updatedAtIso: string;

  source?: {
    agentId?: string;
    runId?: string;
    bundleId?: string;
  };
};

export function marketingQueueKey(projectId: string) {
  return `marketingQueue:project:${projectId}`;
}

export function marketingPublishedLogKey(projectId: string) {
  return `marketingPublished:project:${projectId}`;
}

export function newId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
}

export function nowIso() {
  return new Date().toISOString();
}

function isNonEmptyString(x: any) {
  return typeof x === "string" && x.trim().length > 0;
}

export function normalizeChannel(x: any): MarketingChannel {
  const s = typeof x === "string" ? x.trim().toLowerCase() : "";
  if (s === "landing") return "landing";
  if (s === "seo") return "seo";
  if (s === "blog") return "blog";
  if (s === "social") return "social";
  if (s === "email") return "email";
  if (s === "plan") return "plan";
  return "misc";
}

export function normalizeStatus(x: any): MarketingStatus {
  if (x === "approved") return "approved";
  if (x === "scheduled") return "scheduled";
  if (x === "published") return "published";
  return "draft";
}

export function normalizeItem(x: any, projectId: string): MarketingItem {
  const channel = normalizeChannel(x?.channel);
  const type = isNonEmptyString(x?.type) ? String(x.type).trim() : "copy";
  const title = isNonEmptyString(x?.title) ? String(x.title).trim() : "Untitled";
  const body = typeof x?.body === "string" ? x.body : String(x?.body ?? "");

  const id = isNonEmptyString(x?.id) ? String(x.id).trim() : newId("mq");
  const createdAtIso = isNonEmptyString(x?.createdAtIso) ? String(x.createdAtIso) : nowIso();
  const updatedAtIso = isNonEmptyString(x?.updatedAtIso) ? String(x.updatedAtIso) : nowIso();

  const status = normalizeStatus(x?.status);

  let scheduledForIso: string | null | undefined = null;
  if (isNonEmptyString(x?.scheduledForIso)) scheduledForIso = String(x.scheduledForIso);

  const item: MarketingItem = {
    id,
    projectId,
    channel,
    type,
    title,
    body,
    status,
    scheduledForIso,
    createdAtIso,
    updatedAtIso,
    source: x?.source && typeof x.source === "object" ? x.source : undefined,
  };

  // Safety: scheduled requires a time
  if (item.status === "scheduled" && !item.scheduledForIso) {
    item.status = "approved";
    item.scheduledForIso = null;
  }

  return item;
}

export function summarizeForPatch(items: MarketingItem[]) {
  return items.map(i => ({
    id: i.id,
    channel: i.channel,
    type: i.type,
    title: i.title,
    status: i.status,
    scheduledForIso: i.scheduledForIso || null,
    body: i.body.slice(0, 5000),
  }));
}

export function toUtcEpochMs(iso: string) {
  const t = Date.parse(iso);
  return Number.isFinite(t) ? t : NaN;
}