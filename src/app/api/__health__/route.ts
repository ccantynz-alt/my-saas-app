import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "dominat8",
    heartbeat: "LIVE",
    time: new Date().toISOString(),
  });
}
