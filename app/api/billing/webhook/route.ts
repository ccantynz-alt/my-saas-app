import { NextResponse } from "next/server";

/**
 * Billing webhook endpoint.
 *
 * IMPORTANT:
 * This is temporarily stubbed to prevent Next.js build-time execution errors
 * when Stripe env vars are not configured (STRIPE_SECRET_KEY, webhook secret, etc).
 *
 * Once your Stripe keys are added in Vercel env vars, we can restore the real
 * Stripe webhook verification + event handling.
 */

export async function POST(req: Request) {
  // Read the body so the request is fully consumed (good practice for webhooks)
  const bodyText = await req.text().catch(() => "");

  return NextResponse.json({
    ok: true,
    received: true,
    length: bodyText.length,
    note: "Webhook stubbed until Stripe env vars are configured.",
  });
}
