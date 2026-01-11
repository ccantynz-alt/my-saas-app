import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // Parse body safely
    const body = await req.json().catch(() => ({} as any));
    const message = typeof body?.message === "string" ? body.message : "";

    // Never throw at import-time during builds. Validate env here instead.
    const openaiKey = process.env.OPENAI_API_KEY;

    // If you haven't configured OPENAI_API_KEY yet, return a safe response
    // (prevents "Failed to collect page data" from import-time crashes)
    if (!openaiKey) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "OPENAI_API_KEY is not set. Add it to .env.local (Codespaces) and Vercel env vars.",
        },
        { status: 500 }
      );
    }

    // TODO: Replace this with your real chat implementation.
    // This placeholder keeps builds green and proves the route works.
    return NextResponse.json({
      ok: true,
      reply: `Stub reply received: ${message || "(no message)"}`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { ok: false, error: "Use POST /api/chat" },
    { status: 405 }
  );
}
