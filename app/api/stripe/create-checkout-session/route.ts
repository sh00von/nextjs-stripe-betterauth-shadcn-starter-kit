import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { priceId, userData } = await request.json();
    
    if (!priceId) {
      return NextResponse.json({ error: "Price ID is required" }, { status: 400 });
    }

    // Try to get session from Better Auth first
    let sessionResponse;
    try {
      sessionResponse = await auth.api.getSession({
        headers: request.headers,
      });
    } catch (error) {
      console.log("Better Auth session failed, using provided user data");
    }

    let session = sessionResponse;

    // If Better Auth session fails, use provided user data
    if (!session && userData) {
      session = {
        user: userData,
        session: {
          id: userData.id,
          userId: userData.id,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          createdAt: new Date(),
          updatedAt: new Date(),
          token: userData.id,
        }
      };
    }

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Handle demo price IDs by creating products and prices on the fly
    let actualPriceId = priceId;
    
    if (priceId.startsWith("price_") && priceId.includes("_demo")) {
      // Create demo products and prices
      const productName = priceId.includes("starter") ? "Starter Plan" : 
                         priceId.includes("pro") ? "Pro Plan" : "Enterprise Plan";
      const amount = priceId.includes("starter") ? 900 : 
                    priceId.includes("pro") ? 2900 : 9900; // Amount in cents

      // Create product
      const product = await stripe.products.create({
        name: productName,
        description: `Demo ${productName} for NextJS BetterAuth Stripe Shadcnui Starter Kit`,
      });

      // Create price
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: amount,
        currency: "usd",
        recurring: {
          interval: "month",
        },
      });

      actualPriceId = price.id;
    }

    // Get full user profile data
    let userProfile;
    try {
      const profileResponse = await fetch(`${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/api/profile/me`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userData: session.user }),
      });

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        userProfile = profileData.user;
        console.log("Retrieved user profile:", {
          id: userProfile.id,
          email: userProfile.email,
          name: userProfile.name
        });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }

    // Create or retrieve customer
    let customer;
    try {
      // Try to find existing customer by email
      const existingCustomers = await stripe.customers.list({
        email: session.user.email,
        limit: 1,
      });

      if (existingCustomers.data.length > 0) {
        customer = existingCustomers.data[0];
        console.log("Found existing customer:", {
          id: customer.id,
          email: customer.email,
          name: customer.name,
          metadata: customer.metadata
        });
        
        // Update customer with latest profile data if available
        if (userProfile && (userProfile.name !== customer.name || userProfile.email !== customer.email)) {
          customer = await stripe.customers.update(customer.id, {
            email: userProfile.email,
            name: userProfile.name || undefined,
            metadata: {
              userId: userProfile.id,
            },
          });
          console.log("Updated existing customer:", customer.id);
        }
      } else {
        // Create new customer with profile data
        customer = await stripe.customers.create({
          email: userProfile?.email || session.user.email,
          name: userProfile?.name || session.user.name || undefined,
          metadata: {
            userId: session.user.id,
          },
        });
        console.log("Created new customer:", customer.id);
      }
    } catch (error) {
      console.error("Error handling customer:", error);
      // Fallback to customer_email if customer creation fails
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: actualPriceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/#pricing?canceled=true`,
      ...(customer ? { customer: customer.id } : { customer_email: session.user.email }),
      metadata: {
        userId: session.user.id,
        planId: priceId,
      },
    });

    console.log("Checkout session created:", {
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
      metadata: checkoutSession.metadata,
      customer: checkoutSession.customer,
      customerEmail: checkoutSession.customer_email,
      customerDetails: customer ? {
        id: customer.id,
        email: customer.email,
        name: customer.name
      } : null
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch {
    console.error("Error creating checkout session");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
