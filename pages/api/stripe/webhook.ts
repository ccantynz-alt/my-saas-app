import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { kv } from "@vercel/kv";

export const config = {
  api: { bodyParser: false },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

async function readRawBody(req: NextApiRequest): Promise<Buffer> {
  return await new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) =>
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    );
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return res.status(200).json({ ok: true, note: "stripe webhook route is alive (GET)" });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, GET");
    return res.status(405).send("Method Not Allowed");
  }

  try {
    const sig = req.headers["stripe-signature"];
    if (!sig || Array.isArray(sig)) {
      return res.status(400).send("Missing Stripe signature");
    }

    const rawBody = await readRawBody(req);

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return res.status(500).send("Missing STRIPE_WEBHOOK_SECRET");
    }

    const event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);

    // Always log receipt
    await kv.lpush("stripe:webhook:received", {
      at: new Date().toISOString(),
      method: "POST",
      type: event.type,
      id: event.id,
    });
    await kv.ltrim("stripe:webhook:received", 0, 49);

    // ✅ Grant Pro when checkout completes
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const clerkUserId = session.metadata?.clerkUserId;

      if (!clerkUserId) {
        await kv.lpush("stripe:webhook:unlinked", {
          at: new Date().toISOString(),
          type: event.type,
          id: event.id,
          note: "Missing session.metadata.clerkUserId",
        });
        await kv.ltrim("stripe:webhook:unlinked", 0, 49);
      } else {
        await kv.set(`plan:clerk:${clerkUserId}`, "pro");
      }
    }

    // ✅ Optional downgrade rules
    if (
      event.type === "customer.subscription.deleted" ||
      event.type === "invoice.payment_failed"
    ) {
      // If you later store a subscription->clerk mapping, you can downgrade reliably here.
      // For now we leave this simple.
    }

    return res.status(200).json({ ok: true });
  } catch (err: any) {
    await kv.lpush("stripe:webhook:errors", {
      at: new Date().toISOString(),
      message: err?.message || String(err),
    });
    await kv.ltrim("stripe:webhook:errors", 0, 49);

    return res.status(400).send(`Webhook Error: ${err?.message || String(err)}`);
  }
}
