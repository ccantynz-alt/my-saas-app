import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { kv } from "@vercel/kv";

/**
 * Stripe requires the raw body for signature verification. :contentReference[oaicite:5]{index=5}
 * In Next.js Route Handlers, we can read raw body via req.text().
 */
export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ ok: false, error: "Missing Stripe signature or webhook secret" }, { status: 400 });
  }

  const rawBody = await req.text();

  let event: any;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: `Webhook signature verification failed: ${err?.message || "unknown"}` }, { status: 400 });
  }

  try {
    // We care most about subscription becoming active/paid
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;

      const clerkUserId = session?.metadata?.clerkUserId || null;
      const customerId = session?.customer || null;
      const subscriptionId = session?.subscription || null;

      if (clerkUserId) {
        await kv.hset(`sub:user:${clerkUserId}`, {
          status: "active",
          clerkUserId,
          customerId,
          subscriptionId,
          updatedAt: Date.now(),
        });
      }
    }

    // Track subscription status updates too (cancel, past_due, etc.)
    if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
      const sub = event.data.object as any;
      const status = sub?.status || "unknown";
      const customerId = sub?.customer || null;

      // If you later store a mapping customerId -> clerkUserId, you can update from here.
      // For now, we keep the main activation from checkout.session.completed.
      // This block is kept for future expansion safely.
      if (customerId) {
        await kv.hset(`sub:customer:${customerId}`, {
          status,
          customerId,
          subscriptionId: sub?.id || null,
          updatedAt: Date.now(),
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Webhook handler error" }, { status: 500 });
  }
}
