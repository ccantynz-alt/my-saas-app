import Stripe from "stripe";

export const runtime = "nodejs"; // Stripe needs Node runtime (not Edge)

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export async function POST(req: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return Response.json(
        { ok: false, error: "Missing STRIPE_SECRET_KEY" },
        { status: 500 }
      );
    }

    if (!process.env.STRIPE_PRICE_PRO) {
      return Response.json(
        { ok: false, error: "Missing STRIPE_PRICE_PRO (price_...)" },
        { status: 500 }
      );
    }

    // Derive origin safely (works on Vercel)
    const origin =
      req.headers.get("origin") ||
      `https://${req.headers.get("host") || "my-saas-app-5eyw.vercel.app"}`;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: process.env.STRIPE_PRICE_PRO,
          quantity: 1,
        },
      ],
      success_url: `${origin}/billing?success=1`,
      cancel_url: `${origin}/billing?canceled=1`,
      metadata: {},
    });

    return Response.json({ ok: true, url: session.url }, { status: 200 });
  } catch (err: any) {
    return Response.json(
      { ok: false, error: err?.message || String(err) },
      { status: 500 }
    );
  }
}
