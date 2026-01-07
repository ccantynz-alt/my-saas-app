// app/api/billing/status/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { kv } from "@vercel/kv";

export const runtime = "nodejs";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ ok: false, error: "Not signed in" }, { status: 401 });
  }

  const key = `sub:clerk:${userId}`;
  const sub = await kv.get(key);

  return NextResponse.json({
    ok: true,
    userId,
    key,
    subscription: sub ?? null,
  });
}
