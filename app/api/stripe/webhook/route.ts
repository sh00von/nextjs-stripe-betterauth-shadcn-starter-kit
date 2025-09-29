import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

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

    // Log the raw body for debugging (first 500 chars)
    console.log("Raw body preview:", body.substring(0, 500));

    if (!signature) {
      console.log("❌ No signature provided");
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.log("❌ STRIPE_WEBHOOK_SECRET not configured");
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
    }

    let event;

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
        const session = event.data.object;
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
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string) as unknown as {
            customer: string; 
            id: string; 
            status: string; 
            items: { data: Array<{ price: { id: string } }> }; 
            current_period_end: number; 
          };
          console.log("Retrieved subscription:", {
            id: subscription.id,
            status: subscription.status,
            priceId: subscription.items.data[0]?.price.id,
            currentPeriodEnd: subscription.current_period_end,
            customer: subscription.customer
          });
          
          console.log("💾 Saving subscription to database...");
          try {
            const result = await prisma.subscription.upsert({
              where: {
                userId: session.metadata?.userId || "",
              },
              update: {
                stripeCustomerId: session.customer as string,
                stripeSubscriptionId: subscription.id,
                stripePriceId: subscription.items.data[0]?.price.id,
                stripeStatus: subscription.status,
                stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
              },
              create: {
                userId: session.metadata?.userId || "",
                stripeCustomerId: session.customer as string,
                stripeSubscriptionId: subscription.id,
                stripePriceId: subscription.items.data[0]?.price.id,
                stripeStatus: subscription.status,
                stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
              },
            });
            
            console.log("✅ Subscription saved to database:", {
              userId: session.metadata?.userId,
              planId: session.metadata?.planId,
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
            throw dbError;
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
        const updatedSubscription = event.data.object as unknown as { 
          id: string; 
          status: string; 
          current_period_end: number; 
        };
        console.log("Subscription updated:", updatedSubscription.id);
        
        // Update subscription in database
        await prisma.subscription.updateMany({
          where: {
            stripeSubscriptionId: updatedSubscription.id,
          },
          data: {
            stripeStatus: updatedSubscription.status,
            stripeCurrentPeriodEnd: new Date(updatedSubscription.current_period_end * 1000),
          },
        });
        break;

      case "customer.subscription.deleted":
        const deletedSubscription = event.data.object as { id: string };
        console.log("Subscription canceled:", deletedSubscription.id);
        
        // Update subscription status to canceled
        await prisma.subscription.updateMany({
          where: {
            stripeSubscriptionId: deletedSubscription.id,
          },
          data: {
            stripeStatus: "canceled",
          },
        });
        break;

      default:
        console.log(`⚠️ Unhandled event type: ${event.type}`);
        console.log("Event data:", JSON.stringify(event.data, null, 2));
    }

    console.log("✅ Webhook processed successfully");
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
