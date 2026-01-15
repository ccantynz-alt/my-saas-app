import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    ok: true,
    source: "app/api/__probe__/route.ts",
    method: "GET",
    time: new Date().toISOString(),
  });
}

export async function POST() {
  return NextResponse.json({
    ok: true,
    source: "app/api/__probe__/route.ts",
    method: "POST",
    time: new Date().toISOString(),
  });
}
