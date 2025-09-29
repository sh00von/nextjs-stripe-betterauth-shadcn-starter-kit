import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();
    
    console.log("=== VERIFY SESSION API CALLED ===");
    console.log("Session ID:", sessionId);
    
    if (!sessionId) {
      console.log("❌ No session ID provided");
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
    }

    // Retrieve the checkout session from Stripe
    console.log("🔍 Retrieving session from Stripe...");
    let session;
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['subscription'],
      });
      console.log("✅ Session retrieved:", {
        id: session.id,
        payment_status: session.payment_status,
        subscription: session.subscription ? "present" : "missing",
        metadata: session.metadata
      });
    } catch (stripeError) {
      console.error("❌ Stripe API error:", stripeError);
      throw new Error(`Failed to retrieve session from Stripe: ${stripeError instanceof Error ? stripeError.message : 'Unknown Stripe error'}`);
    }

    if (!session) {
      console.log("❌ Session not found");
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Check if payment was successful
    console.log("🔍 Checking payment status...");
    console.log("Payment status:", session.payment_status);
    console.log("Has subscription:", !!session.subscription);
    
    if (session.payment_status === 'paid' && session.subscription) {
      console.log("✅ Payment successful, processing subscription...");
      const subscription = session.subscription as any;
      
      console.log("Subscription details:", {
        id: subscription.id,
        status: subscription.status,
        priceId: subscription.items?.data?.[0]?.price?.id,
        currentPeriodEnd: subscription.current_period_end,
        currentPeriodEndType: typeof subscription.current_period_end
      });
      
      // Create or update subscription in database
      try {
        console.log("💾 Saving subscription to database...");
        // Validate and format the current period end date
        let currentPeriodEnd: Date;
        if (subscription.current_period_end) {
          // Stripe timestamps are in seconds, convert to milliseconds
          const timestamp = subscription.current_period_end * 1000;
          currentPeriodEnd = new Date(timestamp);
          
          // Validate the date
          if (isNaN(currentPeriodEnd.getTime())) {
            console.warn("⚠️ Invalid current_period_end timestamp, using fallback date");
            currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
          }
        } else {
          console.warn("⚠️ No current_period_end found, using fallback date");
          currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
        }

        console.log("Database input:", {
          userId: session.metadata?.userId,
          customerId: session.customer,
          subscriptionId: subscription.id,
          priceId: subscription.items.data[0]?.price.id,
          status: subscription.status,
          periodEnd: subscription.current_period_end,
          formattedPeriodEnd: currentPeriodEnd.toISOString()
        });

        const dbSubscription = await prisma.subscription.upsert({
          where: {
            userId: session.metadata?.userId || "",
          },
          update: {
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: subscription.id,
            stripePriceId: subscription.items.data[0]?.price.id,
            stripeStatus: subscription.status,
            stripeCurrentPeriodEnd: currentPeriodEnd,
          },
          create: {
            userId: session.metadata?.userId || "",
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: subscription.id,
            stripePriceId: subscription.items.data[0]?.price.id,
            stripeStatus: subscription.status,
            stripeCurrentPeriodEnd: currentPeriodEnd,
          },
        });

        console.log("✅ Subscription saved to database:", {
          id: dbSubscription.id,
          userId: dbSubscription.userId,
          status: dbSubscription.stripeStatus
        });

        return NextResponse.json({ 
          success: true, 
          subscription: dbSubscription,
          session: {
            id: session.id,
            payment_status: session.payment_status,
            subscription_id: subscription.id
          }
        });
      } catch (dbError) {
        console.error("❌ Database error:", dbError);
        console.error("Database error details:", {
          message: dbError instanceof Error ? dbError.message : "Unknown database error",
          stack: dbError instanceof Error ? dbError.stack : "No stack trace"
        });
        return NextResponse.json({ 
          success: false, 
          error: "Database error",
          message: "Payment successful but failed to save subscription",
          details: dbError instanceof Error ? dbError.message : "Unknown database error"
        }, { status: 500 });
      }
    }

    console.log("⚠️ Payment not completed or no subscription");
    return NextResponse.json({ 
      success: false, 
      message: "Payment not completed",
      session: {
        id: session.id,
        payment_status: session.payment_status,
        has_subscription: !!session.subscription
      }
    });
  } catch (error) {
    console.error("❌ Error verifying session:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : "No stack trace",
      sessionId: sessionId
    });
    
    // Return more specific error information
    return NextResponse.json(
      { 
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error occurred",
        sessionId: sessionId
      },
      { status: 500 }
    );
  }
}
