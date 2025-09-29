export const PRICING_PLANS = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for individuals getting started",
    price: 9,
    interval: "month",
    features: [
      "Up to 5 projects",
      "Basic analytics",
      "Email support",
      "1GB storage",
    ],
    stripePriceId: "price_starter_demo", // Replace with actual Stripe price ID
  },
  {
    id: "pro",
    name: "Pro",
    description: "Best for growing teams",
    price: 29,
    interval: "month",
    features: [
      "Unlimited projects",
      "Advanced analytics",
      "Priority support",
      "Team collaboration",
    ],
    stripePriceId: "price_pro_demo", // Replace with actual Stripe price ID
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large organizations",
    price: 99,
    interval: "month",
    features: [
      "Everything in Pro",
      "Custom integrations",
      "Dedicated support",
      "SLA guarantee",
    ],
    stripePriceId: "price_enterprise_demo", // Replace with actual Stripe price ID
  },
];
