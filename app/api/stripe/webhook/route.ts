// app/api/stripe/webhook/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { kv } from "@vercel/kv";

export const runtime = "nodejs";

async function upsertSubscriptionForUser(params: {
  clerkUserId: string;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  status?: string | null;
  priceId?: string | null;
  currentPeriodEnd?: number | null;
  cancelAtPeriodEnd?: boolean | null;
  plan?: string | null;
}) {
  const key = `sub:clerk:${params.clerkUserId}`;

  await kv.set(key, {
    clerkUserId: params.clerkUserId,
    stripeCustomerId: params.stripeCustomerId ?? null,
    stripeSubscriptionId: params.stripeSubscriptionId ?? null,
    status: params.status ?? null,
    priceId: params.priceId ?? null,
    currentPeriodEnd: params.currentPeriodEnd ?? null,
    cancelAtPeriodEnd: params.cancelAtPeriodEnd ?? null,
    plan: params.plan ?? null,
    updatedAt: new Date().toISOString(),
  });

  if (params.stripeCustomerId) {
    await kv.set(`sub:customer:${params.stripeCustomerId}`, params.clerkUserId);
  }
}

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const whsec = process.env.STRIPE_WEBHOOK_SECRET;

  // ✅ Log missing secret/signature instead of crashing
  if (!sig || !whsec) {
    await kv.lpush("stripe:webhook:errors", {
      at: new Date().toISOString(),
      error: "Missing stripe-signature header or STRIPE_WEBHOOK_SECRET env var",
      hasStripeSignatureHeader: !!sig,
      hasWebhookSecretEnv: !!whsec,
    });

    return NextResponse.json(
      { ok: false, error: "Missing stripe-signature header or STRIPE_WEBHOOK_SECRET env var" },
      { status: 400 }
    );
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    await kv.lpush("stripe:webhook:errors", {
      at: new Date().toISOString(),
      error: "Missing STRIPE_SECRET_KEY env var",
    });

    return NextResponse.json({ ok: false, error: "Missing STRIPE_SECRET_KEY env var" }, { status: 500 });
  }

  const stripe = new Stripe(secretKey, {
    apiVersion: "2025-02-24.acacia",
  });

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, whsec);
  } catch (err: any) {
    await kv.lpush("stripe:webhook:errors", {
      at: new Date().toISOString(),
      error: "Signature verification failed",
      message: err?.message ?? "unknown",
    });

    return NextResponse.json(
      { ok: false, error: `Webhook signature verification failed: ${err?.message ?? "unknown"}` },
      { status: 400 }
    );
  }

  // ✅ Always record that we received an event
  await kv.lpush("stripe:webhook:received", {
    at: new Date().toISOString(),
    id: event.id,
    type: event.type,
    created: event.created,
  });

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const stripeCustomerId =
          typeof session.customer === "string" ? session.customer : session.customer?.id ?? null;

        const clerkUserId = (session.metadata?.clerkUserId as string) || null;

        if (!clerkUserId) {
          await kv.lpush("stripe:webhook:unlinked", {
            at: new Date().toISOString(),
            type: event.type,
            eventId: event.id,
            stripeCustomerId,
          });
          break;
        }

        const subId = typeof session.subscription === "string" ? session.subscription : null;

        await upsertSubscriptionForUser({
          clerkUserId,
          stripeCustomerId,
          stripeSubscriptionId: subId,
          status: "active",
          plan: session.metadata?.plan ?? "pro",
        });

        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;

        const stripeCustomerId =
          typeof sub.customer === "string" ? sub.customer : sub.customer?.id ?? null;

        let clerkUserId = (sub.metadata?.clerkUserId as string) || null;

        if (!clerkUserId && stripeCustomerId) {
          const customer = await stripe.customers.retrieve(stripeCustomerId);
          if (!("deleted" in customer) && customer.metadata?.clerkUserId) {
            clerkUserId = customer.metadata.clerkUserId;
          }
        }

        if (!clerkUserId) {
          await kv.lpush("stripe:webhook:unlinked", {
            at: new Date().toISOString(),
            type: event.type,
            eventId: event.id,
            stripeCustomerId,
            stripeSubscriptionId: sub.id,
          });
          break;
        }

        const priceId = sub.items.data?.[0]?.price?.id ?? null;

        await upsertSubscriptionForUser({
          clerkUserId,
          stripeCustomerId,
          stripeSubscriptionId: sub.id,
          status: sub.status,
          priceId,
          currentPeriodEnd: sub.current_period_end ?? null,
          cancelAtPeriodEnd: sub.cancel_at_period_end ?? null,
          plan: sub.metadata?.plan ?? "pro",
        });

        break;
      }

      default:
        // ignore others
        break;
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    await kv.lpush("stripe:webhook:errors", {
      at: new Date().toISOString(),
      error: "Webhook handler failed",
      message: err?.message ?? "unknown",
      eventType: event.type,
      eventId: event.id,
    });

    return NextResponse.json({ ok: false, error: err?.message ?? "Webhook handler failed" }, { status: 500 });
  }
}
