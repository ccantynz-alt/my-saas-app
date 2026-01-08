import Stripe from "stripe";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export async function POST(req: Request) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return json({ ok: false, error: "Missing STRIPE_SECRET_KEY" }, 500);
    }

    if (!process.env.STRIPE_PRICE_PRO) {
      return json(
        {
          ok: false,
          error: "Missing STRIPE_PRICE_PRO",
          fix: "Set STRIPE_PRICE_PRO to your Stripe Price ID (starts with price_) in Vercel env vars (Production + Preview) then redeploy.",
        },
        500
      );
    }

    const host = req.headers.get("host");
    const origin =
      req.headers.get("origin") || (host ? `https://${host}` : null);

    if (!origin) {
      return json(
        { ok: false, error: "Could not determine origin/host headers" },
        500
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: process.env.STRIPE_PRICE_PRO, quantity: 1 }],
      success_url: `${origin}/billing?success=1`,
      cancel_url: `${origin}/billing?canceled=1`,
      metadata: {},
    });

    return json({ ok: true, url: session.url }, 200);
  } catch (err: any) {
    return json(
      {
        ok: false,
        error: err?.message || String(err),
        type: err?.type,
        code: err?.code,
        statusCode: err?.statusCode,
      },
      500
    );
  }
}
