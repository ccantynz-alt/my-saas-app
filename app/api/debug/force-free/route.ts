// app/api/debug/force-free/route.ts

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { kv } from "@vercel/kv";
import { isAdminUser } from "@/app/lib/admin";

export async function GET() {
  // Still useful for checking it's deployed, but now admin-only.
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const admin = await isAdminUser(userId);
  if (!admin) {
    return NextResponse.json(
      { ok: false, error: "Forbidden" },
      { status: 403 }
    );
  }

  return NextResponse.json({
    ok: true,
    route: "/api/debug/force-free",
    methods: ["GET", "POST"],
    note: "POST will set your plan to free in KV (admin-only).",
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

  const admin = await isAdminUser(userId);
  if (!admin) {
    return NextResponse.json(
      { ok: false, error: "Forbidden" },
      { status: 403 }
    );
  }

  const key = `plan:clerk:${userId}`;
  await kv.set(key, "free");

  return NextResponse.json({
    ok: true,
    userId,
    set: key,
    value: "free",
  });
}
