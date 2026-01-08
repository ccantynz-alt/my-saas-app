// app/api/debug/plan/route.ts

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { kv } from "@vercel/kv";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({
      ok: true,
      signedIn: false,
    });
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
