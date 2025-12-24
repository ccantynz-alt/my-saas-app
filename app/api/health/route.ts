import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    ok: true,
    ts: new Date().toISOString(),
    env: {
      hasOpenAIKey: !!process.env.OPENAI_API_KEY,
      hasKV: !!process.env.KV_REST_API_URL || !!process.env.UPSTASH_REDIS_REST_URL,
    },
  });
}
