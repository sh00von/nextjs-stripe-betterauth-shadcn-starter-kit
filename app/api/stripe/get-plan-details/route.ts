import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const { priceId } = await request.json();
    
    if (!priceId) {
      return NextResponse.json({ error: "Price ID is required" }, { status: 400 });
    }

    // Retrieve the price from Stripe
    const price = await stripe.prices.retrieve(priceId, {
      expand: ['product'],
    });

    // Get the product name
    const product = price.product as { name?: string };
    const productName = product?.name || 'Unknown Plan';

    // Determine plan type based on product name or amount
    let planName = 'Active Plan';
    if (productName.toLowerCase().includes('starter')) {
      planName = 'Starter Plan';
    } else if (productName.toLowerCase().includes('pro')) {
      planName = 'Pro Plan';
    } else if (productName.toLowerCase().includes('enterprise')) {
      planName = 'Enterprise Plan';
    } else if (price.unit_amount) {
      // Fallback: determine by price amount
      const amount = price.unit_amount / 100; // Convert from cents
      if (amount <= 10) {
        planName = 'Starter Plan';
      } else if (amount <= 30) {
        planName = 'Pro Plan';
      } else {
        planName = 'Enterprise Plan';
      }
    }

    return NextResponse.json({ 
      planName,
      productName,
      amount: price.unit_amount,
      currency: price.currency
    });
  } catch (error) {
    console.error("Error fetching plan details:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
