import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const payload = {
      event: String(body?.event ?? "unknown"),
      meta: body?.meta ?? {},
      ts: Number(body?.ts ?? Date.now()),
      ua: req.headers.get("user-agent") ?? "",
    };

    console.log("[TRACK]", JSON.stringify(payload));
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("[TRACK_ERR]", e?.message ?? String(e));
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}