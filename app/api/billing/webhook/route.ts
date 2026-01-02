import { NextResponse } from "next/server";
import { stripe } from "@/app/lib/stripe";
import { setSubscription } from "@/app/lib/billingKV";
import { headers } from "next/headers";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = headers().get("stripe-signature")!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  if (event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated") {

    const sub = event.data.object as any;
    const userId = sub.metadata?.userId;

    if (userId) {
      await setSubscription(userId, {
        status: sub.status,
        priceId: sub.items.data[0].price.id,
        currentPeriodEnd: sub.current_period_end,
      });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as any;
    const userId = sub.metadata?.userId;
    if (userId) {
      await setSubscription(userId, { status: "canceled" });
    }
  }

  return NextResponse.json({ received: true });
}
