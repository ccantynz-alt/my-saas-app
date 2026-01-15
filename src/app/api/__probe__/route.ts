import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    source: "src/app/api/__probe__/route.ts",
    time: new Date().toISOString(),
  });
}

export async function POST() {
  return NextResponse.json({
    ok: true,
    method: "POST",
    source: "src/app/api/__probe__/route.ts",
    time: new Date().toISOString(),
  });
}
