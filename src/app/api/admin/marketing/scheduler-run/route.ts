import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { runMarketingScheduler } from "@/lib/admin/marketingScheduler";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const gate = requireAdmin(req);
  if (!gate.ok) return NextResponse.json({ ok: false, error: gate.error }, { status: 200 });

  const body = await req.json().catch(() => ({}));
  const projectId = String(body?.projectId || "demo").trim();

  const res = await runMarketingScheduler(projectId);
  return NextResponse.json({ ok: true, result: res }, { status: 200 });
}