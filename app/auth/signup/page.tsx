import { SignUpForm } from "@/components/auth/sign-up-form";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Rocket } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/5 to-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      

      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center">
              <Badge variant="outline" className="bg-primary/10 border-primary/20 text-primary px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                NextJS BetterAuth Stripe Shadcnui Starter Kit
              </Badge>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Start Building
              </h1>
              <p className="text-lg text-muted-foreground">
                Create your account and begin your journey with our powerful starter kit
              </p>
            </div>
          </div>

          {/* Form */}
          <SignUpForm />
          
          {/* Footer */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link 
                href="/auth/signin" 
                className="text-primary hover:text-primary/80 font-semibold transition-colors duration-200 hover:underline"
              >
                Sign in here
              </Link>
            </p>
          </div>

          {/* Additional Info */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Free to Start</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Production Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span>Full Stack</span>
              </div>
            </div>
            
            {/* Call to Action */}
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-4">
              <div className="flex items-center justify-center gap-2 text-sm font-medium text-primary">
                <Rocket className="w-4 h-4" />
                <span>Ready to launch your next project?</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
