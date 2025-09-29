"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { useProfile } from "@/hooks/use-profile";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Settings,
  Package,
  CreditCard,
  User,
  Zap,
  BarChart3
} from "lucide-react";
import { showToast } from "@/lib/toast";
import Link from "next/link";

export default function DashboardPage() {
  const { session, loading } = useAuth();
  const searchParams = useSearchParams();
  const { profile, loading: profileLoading, refetch: refetchProfile } = useProfile();
  const [subscription, setSubscription] = useState<{
    id: string;
    userId: string;
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    stripePriceId: string;
    stripeStatus: string;
    stripeCurrentPeriodEnd: Date;
  } | null>(null);
  const [, setSubscriptionLoading] = useState(true);
  const [planName, setPlanName] = useState<string>('Active Plan');

  // Token validation function
  const validateToken = async (token: string) => {
    try {
      const response = await fetch('/api/auth/validate-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.valid;
      }
      return false;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  };

  // Force session check on dashboard mount
  useEffect(() => {
    const checkAuth = async () => {
      if (!loading && !session) {
        // Check localStorage for token
        const storedToken = localStorage.getItem('auth_token');
        if (storedToken) {
          // Validate token with server
          const isValid = await validateToken(storedToken);
          if (!isValid) {
            // Clear invalid token and redirect
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
            window.location.href = '/auth/signin';
          }
        } else {
          // No token found, redirect to signin
          window.location.href = '/auth/signin';
        }
      }
    };

    checkAuth();
  }, [session, loading]);

  // Fetch subscription data
  const fetchSubscription = async () => {
    if (!session?.user) return;
    
    try {
      const userData = localStorage.getItem('user_data');
      const parsedUserData = userData ? JSON.parse(userData) : null;
      
      const response = await fetch("/api/subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userData: parsedUserData }),
      });

      if (response.ok) {
        const data = await response.json();
        setSubscription(data.subscription);
        
        // Fetch plan details if we have a subscription
        if (data.subscription?.stripePriceId) {
          fetchPlanDetails(data.subscription.stripePriceId);
        }
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setSubscriptionLoading(false);
    }
  };

  // Fetch plan details from Stripe
  const fetchPlanDetails = async (priceId: string) => {
    try {
      const response = await fetch("/api/stripe/get-plan-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId }),
      });

      if (response.ok) {
        const data = await response.json();
        setPlanName(data.planName);
      }
    } catch (error) {
      console.error("Error fetching plan details:", error);
    }
  };

  // Handle payment success/cancel
  useEffect(() => {
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");
    const sessionId = searchParams.get("session_id");
    
    console.log("🔍 Dashboard URL params:", { success, canceled, sessionId });
    
    if (success === "true") {
      showToast.success("Payment successful! Welcome to your dashboard.");
      
      // If we have a session ID, verify the payment with Stripe
      if (sessionId) {
        console.log("✅ Session ID found, verifying payment...");
        verifyPayment(sessionId);
      } else {
        console.log("⚠️ No session ID found, just refreshing data...");
        // Fallback: just refresh data
        fetchSubscription();
        refetchProfile();
      }
    } else if (canceled === "true") {
      showToast.info("Payment was canceled. You can try again anytime.");
    }
  }, [searchParams]);

  // Verify payment with Stripe
  const verifyPayment = async (sessionId: string) => {
    try {
      console.log("🔍 Verifying payment with session ID:", sessionId);
      
      const response = await fetch("/api/stripe/verify-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId }),
      });

      console.log("📡 Verification response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("📋 Verification response data:", data);
        
        if (data.success) {
          showToast.success("Subscription activated successfully!");
          // Refresh data
          fetchSubscription();
          refetchProfile();
        } else {
          showToast.warning(`Payment verification: ${data.message || "Pending..."}`);
          // Still refresh data in case webhook already processed it
          fetchSubscription();
          refetchProfile();
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("❌ Verification failed:", errorData);
        showToast.error(`Verification failed: ${errorData.message || errorData.error || "Unknown error"}`);
        // Fallback: refresh data anyway
        fetchSubscription();
        refetchProfile();
      }
    } catch (error) {
      console.error("❌ Error verifying payment:", error);
      showToast.error("Network error during verification. Please refresh the page.");
      // Fallback: refresh data anyway
      fetchSubscription();
      refetchProfile();
    }
  };

  // Fetch subscription when session is available
  useEffect(() => {
    if (session?.user) {
      fetchSubscription();
    }
  }, [session]);

  // Fetch plan details when profile loads
  useEffect(() => {
    if (profile?.subscription?.stripePriceId) {
      fetchPlanDetails(profile.subscription.stripePriceId);
    }
  }, [profile]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-4">You need to be signed in to access this page.</p>
          <Button asChild>
            <Link href="/auth/signin">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">
            Welcome back, {profile?.name || session?.user?.name || 'User'}!
          </h2>
          <p className="text-muted-foreground">Your Stripe-powered SaaS starter kit is ready to customize.</p>
        </div>

        {/* User Profile Section */}
        {profile && (
        <div className="mb-8">
            <Card className="border-0 shadow-sm bg-gradient-to-r from-muted/5 to-muted/10">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 bg-primary/20 rounded-full flex items-center justify-center">
                      {profile.image ? (
                        <img 
                          src={profile.image} 
                          alt={profile.name || 'User'} 
                          className="h-16 w-16 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-8 w-8 text-primary" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{profile.name || 'User'}</h3>
                      <p className="text-muted-foreground">{profile.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant={profile.emailVerified ? "default" : "secondary"} className="text-xs">
                          {profile.emailVerified ? "Verified" : "Unverified"}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Member since {new Date(profile.createdAt).toLocaleDateString()}
                        </Badge>
                      </div>
                    </div>
        </div>

                  <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                    <div className="text-center">
                      <p className="font-semibold text-foreground">{profile.stats.totalSessions}</p>
                      <p>Active Sessions</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-foreground">{profile.stats.totalAccounts}</p>
                      <p>Connected Accounts</p>
                    </div>
                  </div>
                </div>
            </CardContent>
          </Card>
          </div>
        )}

      {/* Active Plan Section */}
      <div className="mb-8">
        <Card className="border-0 shadow-sm bg-gradient-to-r from-primary/5 to-primary/10">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Current Plan</h3>
                  <p className="text-sm text-muted-foreground">Manage your subscription</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {profileLoading ? (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Loading...</p>
                  </div>
                ) : (profile?.subscription && profile.subscription.stripeStatus === 'active') || (subscription && subscription.stripeStatus === 'active') ? (
                  <div className="text-center">
                    <p className="text-sm font-semibold text-green-600">
                      {(() => {
                        const activeSubscription = profile?.subscription || subscription;
                        const priceId = activeSubscription?.stripePriceId;
                        
                        // Check if it's a demo price ID first
                        if (priceId?.includes('starter') || priceId?.includes('price_starter')) {
                          return 'Starter Plan';
                        } else if (priceId?.includes('pro') || priceId?.includes('price_pro')) {
                          return 'Pro Plan';
                        } else if (priceId?.includes('enterprise') || priceId?.includes('price_enterprise')) {
                          return 'Enterprise Plan';
                        } 
                        // Use the fetched plan name for real Stripe price IDs
                        else if (priceId && planName !== 'Active Plan') {
                          return planName;
                        } else if (priceId) {
                          return 'Active Plan';
                        } else {
                          return 'Active Plan';
                        }
                      })()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Next billing: {(() => {
                        const activeSubscription = profile?.subscription || subscription;
                        return activeSubscription?.stripeCurrentPeriodEnd ? 
                          new Date(activeSubscription.stripeCurrentPeriodEnd).toLocaleDateString() : 
                          'N/A';
                      })()}
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">No active plan</p>
                    <p className="text-xs text-muted-foreground">Start with a demo plan</p>
                  </div>
                )}
                
                {(!profile?.subscription || profile.subscription.stripeStatus !== 'active') && (!subscription || subscription.stripeStatus !== 'active') && (
                  <Button asChild className="bg-primary hover:bg-primary/90">
                    <Link href="/#pricing">
                      <CreditCard className="h-4 w-4 mr-2" />
                      Choose Plan
                    </Link>
                  </Button>
                )}
              </div>
            </div>
            </CardContent>
          </Card>
      </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Developer Advertisement Section */}
          <Card className="lg:col-span-2 border-0 shadow-sm bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-primary">Need Custom Development?</CardTitle>
                  <CardDescription>Professional web development services by Shovon</CardDescription>
                </div>
                <Badge variant="secondary" className="bg-primary/20 text-primary">
                  Available
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3 p-4 rounded-lg border border-primary/20">
                    <div className="h-10 w-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Full-Stack Development</h4>
                      <p className="text-xs text-muted-foreground">Next.js, React, Node.js, TypeScript</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-4 rounded-lg border border-primary/20">
                    <div className="h-10 w-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Payment Integration</h4>
                      <p className="text-xs text-muted-foreground">Stripe, PayPal, Webhooks</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-4 rounded-lg border border-primary/20">
                    <div className="h-10 w-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">Authentication Systems</h4>
                      <p className="text-xs text-muted-foreground">Better Auth, OAuth, 2FA</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-4 rounded-lg border border-primary/20">
                    <div className="h-10 w-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">UI/UX Design</h4>
                      <p className="text-xs text-muted-foreground">shadcn/ui, Tailwind, Responsive</p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className=" rounded-lg p-6 border border-primary/20">
                  <div className="text-center space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-primary mb-2">Ready to Build Your Next Project?</h3>
                      <p className="text-sm text-muted-foreground">
                        Let&apos;s discuss your requirements and bring your ideas to life
                      </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <a 
                        href="https://shovon.site" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                      >
                        <Package className="h-4 w-4" />
                        Visit Portfolio
                      </a>
                      
                      <a 
                        href="mailto:minar.svn@gmail.com" 
                        className="inline-flex items-center gap-2 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors text-sm font-medium"
                      >
                        <Settings className="h-4 w-4" />
                        Get in Touch
                      </a>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      <p>Available for consulting, custom development, and enterprise solutions</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Package Details */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Starter Kit Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Authentication</p>
                    <p className="text-xs text-muted-foreground">Better Auth</p>
                  </div>
                </div>
                <Badge variant="secondary">Ready</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Payments</p>
                    <p className="text-xs text-muted-foreground">Stripe Integration</p>
                  </div>
                </div>
                <Badge variant="secondary">Ready</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Package className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">UI Components</p>
                    <p className="text-xs text-muted-foreground">shadcn/ui</p>
                  </div>
                </div>
                <Badge variant="secondary">Ready</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
              <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest updates and notifications</CardDescription>
                </div>
                <Button variant="ghost" size="sm">View all</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="h-2 w-2 bg-green-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Account created successfully</p>
                    <p className="text-xs text-muted-foreground">Just now</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Stripe integration configured</p>
                    <p className="text-xs text-muted-foreground">Template ready</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="h-2 w-2 bg-purple-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Authentication system active</p>
                    <p className="text-xs text-muted-foreground">Better Auth ready</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Get started with your SaaS</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2" asChild>
                  <Link href="/pricing">
                    <CreditCard className="h-5 w-5" />
                    <span className="text-sm">View Pricing</span>
                  </Link>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                  <Settings className="h-5 w-5" />
                  <span className="text-sm">Settings</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                  <BarChart3 className="h-5 w-5" />
                  <span className="text-sm">Analytics</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                  <Package className="h-5 w-5" />
                  <span className="text-sm">Documentation</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}