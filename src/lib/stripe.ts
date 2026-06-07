import Stripe from "stripe";

/**
 * Istanza Stripe lato server (lazy): creata solo a runtime, quando serve.
 * La chiave segreta NON deve mai arrivare al client.
 */
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY non configurata.");
    _stripe = new Stripe(key, {
      apiVersion: "2025-02-24.acacia",
      typescript: true,
    });
  }
  return _stripe;
}
