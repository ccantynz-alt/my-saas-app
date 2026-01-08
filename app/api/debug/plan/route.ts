// app/api/debug/plan/route.ts

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { kv } from "@vercel/kv";
import { isAdminUser } from "@/app/lib/admin";

export async function GET() {
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

  const planKey = `plan:clerk:${userId}`;
  const countKey = `projects:count:${userId}`;

  const plan = (await kv.get(planKey)) ?? "free";
  const projectCount = (await kv.get(countKey)) ?? 0;

  return NextResponse.json({
    ok: true,
    userId,
    plan,
    projectCount,
    planKey,
    countKey,
  });
}
