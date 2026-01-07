import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { ok: false, error: "Missing userId" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing/cancel`,
      metadata: {
        userId,
      },
    });

    return NextResponse.json({ ok: true, url: session.url });
  } catch (err: any) {
    console.error("STRIPE CHECKOUT ERROR:", err);
    return NextResponse.json(
      { ok: false, error: "Stripe checkout failed" },
      { status: 500 }
    );
  }
}
