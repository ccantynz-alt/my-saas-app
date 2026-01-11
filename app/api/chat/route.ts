import { NextRequest, NextResponse } from "next/server";

<<<<<<< HEAD
=======
// Important: never crash at import-time during build
>>>>>>> f11fe85 (Fix build: remove export/static output so API routes build)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
<<<<<<< HEAD
    // Parse body safely
    const body = await req.json().catch(() => ({} as any));
    const message = typeof body?.message === "string" ? body.message : "";

    // Never throw at import-time during builds. Validate env here instead.
    const openaiKey = process.env.OPENAI_API_KEY;

    // If you haven't configured OPENAI_API_KEY yet, return a safe response
    // (prevents "Failed to collect page data" from import-time crashes)
=======
    const body = await req.json().catch(() => ({} as any));
    const message = typeof body?.message === "string" ? body.message : "";

    // Validate env INSIDE the handler (never at top-level)
    const openaiKey = process.env.OPENAI_API_KEY;

>>>>>>> f11fe85 (Fix build: remove export/static output so API routes build)
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

<<<<<<< HEAD
    // TODO: Replace this with your real chat implementation.
    // This placeholder keeps builds green and proves the route works.
=======
    // Stub response to keep build green.
    // Replace with real OpenAI call later.
>>>>>>> f11fe85 (Fix build: remove export/static output so API routes build)
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
