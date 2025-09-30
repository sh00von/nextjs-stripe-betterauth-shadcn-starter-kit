import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

// Track processed events to prevent duplicate processing
const processedEvents = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    console.log("=== WEBHOOK RECEIVED ===");
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    console.log("Webhook received:", { 
      hasSignature: !!signature,
      bodyLength: body.length,
      timestamp: new Date().toISOString(),
      userAgent: headersList.get("user-agent"),
      contentType: headersList.get("content-type")
    });

    // Log sanitized body preview for debugging (avoid sensitive data)
    const bodyPreview = body.substring(0, 200).replace(/"card":\s*{[^}]*}/g, '"card": "[REDACTED]"');
    console.log("Body preview:", bodyPreview);

    if (!signature) {
      console.log("❌ No signature provided");
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.log("❌ STRIPE_WEBHOOK_SECRET not configured");
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
      console.log("✅ Webhook event constructed successfully:", {
        type: event.type,
        id: event.id,
        created: event.created
      });

      // Check for duplicate event processing
      if (processedEvents.has(event.id)) {
        console.log("⚠️ Event already processed, skipping:", event.id);
        return NextResponse.json({ received: true, message: "Event already processed" });
      }
      processedEvents.add(event.id);
    } catch (err) {
      console.error("❌ Webhook signature verification failed:", err);
      console.log("Signature provided:", signature?.substring(0, 20) + "...");
      console.log("Webhook secret configured:", !!process.env.STRIPE_WEBHOOK_SECRET);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        console.log("🎉 Processing checkout.session.completed event");
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Validate required fields
        if (!session.metadata?.userId) {
          console.error("❌ No userId in session metadata");
          return NextResponse.json({ error: "Missing userId in session metadata" }, { status: 400 });
        }

        if (!session.customer) {
          console.error("❌ No customer in session");
          return NextResponse.json({ error: "Missing customer in session" }, { status: 400 });
        }

        console.log("Payment successful:", {
          sessionId: session.id,
          customer: session.customer,
          subscription: session.subscription,
          metadata: session.metadata,
          paymentStatus: session.payment_status,
          mode: session.mode
        });
        
        // Get the subscription details from Stripe
        if (session.subscription) {
          console.log("📋 Retrieving subscription details from Stripe...");
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string) as Stripe.Subscription;
          
          console.log("Retrieved subscription:", {
            id: subscription.id,
            status: subscription.status,
            priceId: subscription.items.data[0]?.price.id,
            currentPeriodEnd: (subscription as any).current_period_end,
            customer: subscription.customer
          });
          
          console.log("💾 Saving subscription to database...");
          try {
            const result = await prisma.subscription.upsert({
              where: {
                userId: session.metadata.userId,
              },
              update: {
                stripeCustomerId: session.customer as string,
                stripeSubscriptionId: subscription.id,
                stripePriceId: subscription.items.data[0]?.price.id,
                stripeStatus: subscription.status,
                stripeCurrentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
              },
              create: {
                userId: session.metadata.userId,
                stripeCustomerId: session.customer as string,
                stripeSubscriptionId: subscription.id,
                stripePriceId: subscription.items.data[0]?.price.id,
                stripeStatus: subscription.status,
                stripeCurrentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
              },
            });
            
            console.log("✅ Subscription saved to database:", {
              userId: session.metadata.userId,
              planId: session.metadata.planId,
              subscriptionId: subscription.id,
              status: subscription.status,
              dbResult: {
                id: result.id,
                userId: result.userId,
                stripeStatus: result.stripeStatus,
                stripePriceId: result.stripePriceId
              }
            });
          } catch (dbError) {
            console.error("❌ Database error:", dbError);
            return NextResponse.json(
              { error: "Failed to save subscription to database" },
              { status: 500 }
            );
          }
        } else {
          console.log("❌ No subscription found in session:", session.id);
          console.log("Session details:", {
            id: session.id,
            mode: session.mode,
            paymentStatus: session.payment_status,
            lineItems: session.line_items
          });
        }
        break;

      case "customer.subscription.updated":
        const updatedSubscription = event.data.object as Stripe.Subscription;
        console.log("Subscription updated:", updatedSubscription.id);
        
        try {
          // Update subscription in database
          const updateResult = await prisma.subscription.updateMany({
            where: {
              stripeSubscriptionId: updatedSubscription.id,
            },
            data: {
              stripeStatus: updatedSubscription.status,
              stripeCurrentPeriodEnd: new Date((updatedSubscription as any).current_period_end * 1000),
            },
          });
          
          console.log("✅ Subscription updated in database:", {
            subscriptionId: updatedSubscription.id,
            status: updatedSubscription.status,
            recordsUpdated: updateResult.count
          });
        } catch (dbError) {
          console.error("❌ Database error updating subscription:", dbError);
          return NextResponse.json(
            { error: "Failed to update subscription in database" },
            { status: 500 }
          );
        }
        break;

      case "customer.subscription.deleted":
        const deletedSubscription = event.data.object as Stripe.Subscription;
        console.log("Subscription canceled:", deletedSubscription.id);
        
        try {
          // Update subscription status to canceled
          const deleteResult = await prisma.subscription.updateMany({
            where: {
              stripeSubscriptionId: deletedSubscription.id,
            },
            data: {
              stripeStatus: "canceled",
            },
          });
          
          console.log("✅ Subscription canceled in database:", {
            subscriptionId: deletedSubscription.id,
            recordsUpdated: deleteResult.count
          });
        } catch (dbError) {
          console.error("❌ Database error canceling subscription:", dbError);
          return NextResponse.json(
            { error: "Failed to cancel subscription in database" },
            { status: 500 }
          );
        }
        break;

      default:
        console.log(`⚠️ Unhandled event type: ${event.type}`);
        // Log sanitized event data to avoid sensitive information
        const sanitizedData = JSON.stringify(event.data, (key, value) => {
          if (key === 'card' || key === 'payment_method_details') {
            return '[REDACTED]';
          }
          return value;
        }, 2);
        console.log("Event data:", sanitizedData);
    }

    console.log("✅ Webhook processed successfully");
    return NextResponse.json({ 
      received: true, 
      eventId: event.id,
      eventType: event.type 
    });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
    
    // Return appropriate error response based on error type
    if (error instanceof Error) {
      if (error.message.includes('signature')) {
        return NextResponse.json(
          { error: "Invalid webhook signature" },
          { status: 400 }
        );
      }
      if (error.message.includes('database') || error.message.includes('prisma')) {
        return NextResponse.json(
          { error: "Database operation failed" },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
