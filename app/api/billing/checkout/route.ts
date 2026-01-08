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
    const price = process.env.STRIPE_PRICE_PRO || "";
    const key = process.env.STRIPE_SECRET_KEY || "";

    if (!key) {
      return json(
        {
          ok: false,
          error: "Missing STRIPE_SECRET_KEY",
          vercel_env: process.env.VERCEL_ENV || null,
        },
        500
      );
    }

    if (!price) {
      return json(
        {
          ok: false,
          error: "Missing STRIPE_PRICE_PRO",
          vercel_env: process.env.VERCEL_ENV || null,
          hint:
            "This means the running deployment does not have STRIPE_PRICE_PRO in its environment (Production vs Preview mismatch, wrong project, or not redeployed).",
        },
        500
      );
    }

    const host = req.headers.get("host");
    const origin =
      req.headers.get("origin") || (host ? `https://${host}` : null);

    if (!origin) {
      return json({ ok: false, error: "Could not determine origin" }, 500);
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price, quantity: 1 }],
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
