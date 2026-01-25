import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = String(body?.email ?? "").trim();

    if (!email || email.length < 5 || !email.includes("@")) {
      return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
    }

    const payload = {
      email,
      source: String(body?.source ?? "unknown"),
      page: String(body?.page ?? ""),
      ts: Number(body?.ts ?? Date.now()),
      ua: req.headers.get("user-agent") ?? "",
      ipHint: req.headers.get("x-forwarded-for") ?? "",
    };

    // For now: server-side log (safe, won’t break builds).
    // Next bundle: store to KV/DB + email tool + dedupe.
    console.log("[LEAD]", JSON.stringify(payload));

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("[LEAD_ERR]", e?.message ?? String(e));
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}