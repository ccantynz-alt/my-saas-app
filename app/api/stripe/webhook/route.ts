import { NextResponse } from "next/server";

/**
 * Stripe webhook endpoint.
 *
 * Temporarily stubbed to prevent build-time crashes when Stripe keys are missing.
 * Restore real Stripe verification + handling once env vars are set.
 */

export async function POST(req: Request) {
  const bodyText = await req.text().catch(() => "");

  return NextResponse.json({
    ok: true,
    received: true,
    length: bodyText.length,
    note: "Webhook stubbed until Stripe env vars are configured.",
  });
}
