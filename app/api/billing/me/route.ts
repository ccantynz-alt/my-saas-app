import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { auth } from "@clerk/nextjs/server";

export const runtime = "nodejs";

export async function GET() {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ ok: false, error: "Not signed in" }, { status: 401 });
  }

  const billing = await kv.get<any>(`billing:user:${userId}`);

  return NextResponse.json({
    ok: true,
    userId,
    billing: billing ?? { plan: "free", status: "unknown" },
  });
}
