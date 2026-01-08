// app/api/debug/force-free/route.ts

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { kv } from "@vercel/kv";

export async function POST() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const key = `plan:clerk:${userId}`;
  await kv.set(key, "free");

  return NextResponse.json({
    ok: true,
    set: key,
    value: "free",
  });
}
