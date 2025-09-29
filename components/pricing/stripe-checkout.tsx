"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { showToast } from "@/lib/toast";
import { useAuth } from "@/components/auth/auth-provider";
import { useRouter } from "next/navigation";

interface StripeCheckoutProps {
  priceId: string;
  planName: string;
  isPopular?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function StripeCheckout({ 
  priceId, 
  planName: _, 
  isPopular = false, 
  className = "",
  children 
}: StripeCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const { session } = useAuth();
  const router = useRouter();

  const handleCheckout = async () => {
    if (!session) {
      showToast.error("Please sign in to continue");
      router.push("/auth/signin");
      return;
    }

    if (!priceId) {
      showToast.error("Price ID not configured for this plan");
      return;
    }

    setLoading(true);

    try {
      // Get user data from localStorage
      const userData = localStorage.getItem('user_data');
      const parsedUserData = userData ? JSON.parse(userData) : null;
      
      const response = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          priceId,
          userData: parsedUserData
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      showToast.error(
        error instanceof Error ? error.message : "Failed to start checkout"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleCheckout}
      disabled={loading}
      className={`w-full h-12 sm:h-14 lg:h-16 text-base sm:text-lg font-semibold rounded-2xl transition-all duration-300 hover:scale-105 ${
        isPopular 
          ? 'bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl' 
          : 'bg-foreground hover:bg-foreground/90 text-background hover:text-background'
      } ${className}`}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          {children}
          <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
        </>
      )}
    </Button>
  );
}
