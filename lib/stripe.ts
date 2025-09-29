import Stripe from "stripe";

// Get the Stripe secret key with fallback
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "sk_test_51S80rN7Cch6WMpJPVTrBuvC1WYpoSqNAitYofqGaEWhPSHUWDYn00HgAm2tizTpO81CqQROKXo1TlCOHJYKaIdpm00QELr9cX9";

if (!stripeSecretKey) {
  console.error("STRIPE_SECRET_KEY environment variable is not set");
  throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-08-27.basil",
});

