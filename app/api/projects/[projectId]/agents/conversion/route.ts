import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export const runtime = "nodejs";

type RouteContext = {
  params: { projectId: string };
};

// Basic health/status endpoint (optional but useful)
export async function GET(_req: Request, ctx: RouteContext) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    ok: true,
    agent: "conversion",
    projectId: ctx.params.projectId,
    message:
      "Conversion agent endpoint is online. Call POST with instructions to run the agent.",
  });
}

// Main endpoint the UI can call
export async function POST(req: Request, ctx: RouteContext) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const projectId = ctx.params.projectId;

  let body: any = null;
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const instructions =
    typeof body?.instructions === "string" ? body.instructions.trim() : "";

  // NOTE:
  // This endpoint is intentionally safe and minimal so it compiles and unblocks deploys.
  // You can wire it to real agent logic later (KV read/write + HTML improvements + logging).

  return NextResponse.json({
    ok: true,
    projectId,
    userId,
    accepted: true,
    instructions,
    message:
      "Conversion agent request accepted (stub). Next step: wire to real agent logic + store agent log.",
  });
}
