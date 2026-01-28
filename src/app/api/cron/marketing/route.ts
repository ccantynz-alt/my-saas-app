import { NextResponse } from "next/server";
import { runMarketingScheduler } from "@/lib/admin/marketingScheduler";

export const runtime = "nodejs";

function isAuthorized(req: Request) {
  const secret = process.env.CRON_SECRET || "";
  if (!secret) return false;

  // Vercel cron sends Authorization header when CRON_SECRET is set.
  // Expected: "Bearer <CRON_SECRET>"
  const auth = req.headers.get("authorization") || "";
  return auth.trim() === `Bearer ${secret}`;
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized cron" }, { status: 401 });
  }

  const url = new URL(req.url);
  const projectId = String(url.searchParams.get("projectId") || "demo").trim();

  const res = await runMarketingScheduler(projectId);
  return NextResponse.json({ ok: true, cron: true, result: res }, { status: 200 });
}