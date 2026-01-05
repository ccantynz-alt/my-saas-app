import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/app/lib/getCurrentUserId";

export async function GET(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    projectId: params.projectId,
    domains: [],
  });
}

export async function POST(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));

  return NextResponse.json({
    ok: true,
    projectId: params.projectId,
    created: true,
    body,
  });
}
