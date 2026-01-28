import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { kvGetJson } from "@/lib/d8kv";
import { marketingQueueKey, normalizeItem, MarketingItem } from "@/lib/admin/marketingQueue";

export const runtime = "nodejs";

async function loadQueue(projectId: string): Promise<MarketingItem[]> {
  const v = await kvGetJson<any>(marketingQueueKey(projectId));
  if (!v) return [];
  if (Array.isArray(v)) return v.map(x => normalizeItem(x, projectId));
  if (Array.isArray(v?.items)) return v.items.map((x: any) => normalizeItem(x, projectId));
  return [];
}

function toIcsDate(iso: string) {
  // YYYYMMDDTHHMMSSZ
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth()+1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
}

function esc(s: string) {
  return String(s || "").replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

export async function GET(req: Request) {
  const gate = requireAdmin(req);
  if (!gate.ok) return NextResponse.json({ ok: false, error: gate.error }, { status: 200 });

  const url = new URL(req.url);
  const projectId = String(url.searchParams.get("projectId") || "demo").trim();

  const items = (await loadQueue(projectId))
    .filter(x => x.status === "scheduled" && x.scheduledForIso);

  const now = new Date().toISOString();
  const dtstamp = toIcsDate(now);

  const lines: string[] = [];
  lines.push("BEGIN:VCALENDAR");
  lines.push("VERSION:2.0");
  lines.push("PRODID:-//Dominat8//MarketingQueue//EN");
  lines.push("CALSCALE:GREGORIAN");
  lines.push(`X-WR-CALNAME:${esc("Dominat8 Marketing Queue (" + projectId + ")")}`);

  for (const it of items) {
    const start = toIcsDate(it.scheduledForIso!);
    // default 20 minutes
    const end = toIcsDate(new Date(Date.parse(it.scheduledForIso!) + 20 * 60 * 1000).toISOString());

    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${esc(it.id)}@dominat8`);
    lines.push(`DTSTAMP:${dtstamp}`);
    lines.push(`DTSTART:${start}`);
    lines.push(`DTEND:${end}`);
    lines.push(`SUMMARY:${esc("Publish: " + it.channel.toUpperCase() + " — " + it.title)}`);
    lines.push(`DESCRIPTION:${esc((it.body || "").slice(0, 1800))}`);
    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");

  const ics = lines.join("\r\n") + "\r\n";
  const filename = `dominat8_marketing_queue_${projectId}.ics`;

  return new NextResponse(ics, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}