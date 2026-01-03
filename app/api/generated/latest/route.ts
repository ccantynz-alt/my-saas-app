import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await kv.get("generated:latest");

  return NextResponse.json(
    { ok: true, data: data || null },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
}
