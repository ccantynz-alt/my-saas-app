// /app/lib/stripe.ts
import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;

if (!key) {
  throw new Error("Missing STRIPE_SECRET_KEY env var");
}

// ✅ Do NOT hardcode apiVersion — avoids type mismatch forever
export const stripe = new Stripe(key);
