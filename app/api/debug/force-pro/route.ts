// app/api/debug/force-pro/route.ts

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { kv } from "@vercel/kv";

export async function GET() {
  return NextResponse.json({
    ok: true,
    route: "/api/debug/force-pro",
    methods: ["GET", "POST"],
    note: "POST will set your plan to pro in KV.",
  });
}

export async function POST() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const key = `plan:clerk:${userId}`;
  await kv.set(key, "pro");

  return NextResponse.json({
    ok: true,
    userId,
    set: key,
    value: "pro",
  });
}
