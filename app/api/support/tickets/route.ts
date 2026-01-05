import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  // TODO: Replace this stub with real ticket listing from your DB/KV
  return NextResponse.json({
    ok: true,
    tickets: [],
  });
}

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));

  // TODO: Replace this stub with real ticket creation in your DB/KV
  return NextResponse.json({
    ok: true,
    created: true,
    ticket: {
      id: `ticket_${Date.now()}`,
      userId,
      ...body,
    },
  });
}
