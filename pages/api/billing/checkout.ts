import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ ok: false, error: "Method not allowed" });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return res
        .status(500)
        .json({ ok: false, error: "Missing STRIPE_SECRET_KEY" });
    }

    // ✅ TODO later: attach Clerk userId in metadata
    // For now, just create a simple subscription checkout session.

    const origin =
      (req.headers.origin as string) || "https://my-saas-app-5eyw.vercel.app";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      // IMPORTANT: replace this with your real PRICE ID in Stripe
      // Example: price_12345
      line_items: [
        {
          price: process.env.STRIPE_PRICE_PRO || "",
          quantity: 1,
        },
      ],
      success_url: `${origin}/billing?success=1`,
      cancel_url: `${origin}/billing?canceled=1`,
      // We'll add metadata once webhooks are landing.
      metadata: {},
    });

    return res.status(200).json({ ok: true, url: session.url });
  } catch (err: any) {
    // Always return JSON
    return res.status(500).json({
      ok: false,
      error: err?.message || String(err),
    });
  }
}
