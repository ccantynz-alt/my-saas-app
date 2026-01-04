import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { kv } from "@vercel/kv";

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const sub = await kv.hgetall<any>(`sub:user:${userId}`);

  return NextResponse.json({
    ok: true,
    subscription: sub || { status: "none" },
  });
}
