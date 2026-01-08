// app/api/projects/route.ts

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { kv } from "@vercel/kv";
import { nanoid } from "nanoid";

import {
  enforceProjectLimit,
  incrementProjectCount,
} from "@/app/lib/billing";

export async function POST(req: Request) {
  try {
    // IMPORTANT: Clerk auth is ASYNC
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 🚨 ENFORCE PLAN LIMITS BEFORE CREATING PROJECT
    try {
      await enforceProjectLimit(userId);
    } catch (err: any) {
      return NextResponse.json(
        {
          ok: false,
          error: err.message,
        },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const name =
      typeof body?.name === "string" && body.name.trim()
        ? body.name.trim()
        : "Untitled Project";

    const projectId = `proj_${nanoid()}`;
    const now = Date.now();

    const project = {
      id: projectId,
      userId,
      name,
      createdAt: now,
    };

    // Save project
    await kv.set(`project:${projectId}`, project);

    // Track user projects
    await kv.sadd(`projects:ids:${userId}`, projectId);

    // ✅ INCREMENT PROJECT COUNT AFTER SUCCESS
    await incrementProjectCount(userId);

    return NextResponse.json({
      ok: true,
      project,
    });
  } catch (err) {
    console.error("CREATE PROJECT ERROR:", err);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
