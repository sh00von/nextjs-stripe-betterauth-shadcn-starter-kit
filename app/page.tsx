"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PRICING_PLANS } from "@/lib/pricing";
import { StripeCheckout } from "@/components/pricing/stripe-checkout";
import { 
  ArrowRight, 
  CheckCircle, 
  Shield, 
  Globe,
  Sparkles,
  Star,
  MessageSquare,
  Layers,
  CreditCard
} from "lucide-react";

// SVG Components
const Nextjs = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 394 80" fill="none">
    <path
      d="M261.919 0.0330722H330.547V12.7H303.323V79.339H289.71V12.7H261.919V0.0330722Z"
      fill="currentColor"
    />
    <path
      d="M149.052 0.0330722V12.7H94.0421V33.0772H138.281V45.7441H94.0421V66.6721H149.052V79.339H80.43V12.7H80.4243V0.0330722H149.052Z"
      fill="currentColor"
    />
    <path
      d="M183.32 0.0661486H165.506L229.312 79.3721H247.178L215.271 39.7464L247.127 0.126654L229.312 0.154184L206.352 28.6697L183.32 0.0661486Z"
      fill="currentColor"
    />
    <path
      d="M201.6 56.7148L192.679 45.6229L165.455 79.4326H183.32L201.6 56.7148Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M80.907 79.339L17.0151 0H0V79.3059H13.6121V16.9516L63.8067 79.339H80.907Z"
      fill="currentColor"
    />
    <path
      d="M333.607 78.8546C332.61 78.8546 331.762 78.5093 331.052 77.8186C330.342 77.1279 329.991 76.2917 330 75.3011C329.991 74.3377 330.342 73.5106 331.052 72.8199C331.762 72.1292 332.61 71.7838 333.607 71.7838C334.566 71.7838 335.405 72.1292 336.115 72.8199C336.835 73.5106 337.194 74.3377 337.204 75.3011C337.194 75.9554 337.028 76.5552 336.696 77.0914C336.355 77.6368 335.922 78.064 335.377 78.373C334.842 78.6911 334.252 78.8546 333.607 78.8546Z"
      fill="currentColor"
    />
    <path
      d="M356.84 45.4453H362.872V68.6846C362.863 70.8204 362.401 72.6472 361.498 74.1832C360.585 75.7191 359.321 76.8914 357.698 77.7185C356.084 78.5364 354.193 78.9546 352.044 78.9546C350.079 78.9546 348.318 78.6001 346.75 77.9094C345.182 77.2187 343.937 76.1826 343.024 74.8193C342.101 73.456 341.649 71.7565 341.649 69.7207H347.691C347.7 70.6114 347.903 71.3838 348.29 72.0291C348.677 72.6744 349.212 73.1651 349.895 73.5105C350.586 73.8559 351.38 74.0286 352.274 74.0286C353.243 74.0286 354.073 73.8286 354.746 73.4196C355.419 73.0197 355.936 72.4199 356.296 71.6201C356.646 70.8295 356.831 69.8479 356.84 68.6846V45.4453Z"
      fill="currentColor"
    />
    <path
      d="M387.691 54.5338C387.544 53.1251 386.898 52.0254 385.773 51.2438C384.638 50.4531 383.172 50.0623 381.373 50.0623C380.11 50.0623 379.022 50.2532 378.118 50.6258C377.214 51.0075 376.513 51.5164 376.033 52.1617C375.554 52.807 375.314 53.5432 375.295 54.3703C375.295 55.061 375.461 55.6608 375.784 56.1607C376.107 56.6696 376.54 57.0968 377.103 57.4422C377.656 57.7966 378.274 58.0874 378.948 58.3237C379.63 58.56 380.313 58.76 380.995 58.9236L384.14 59.6961C385.404 59.9869 386.631 60.3778 387.802 60.8776C388.973 61.3684 390.034 61.9955 390.965 62.7498C391.897 63.5042 392.635 64.413 393.179 65.4764C393.723 66.5397 394 67.7848 394 69.2208C394 71.1566 393.502 72.8562 392.496 74.3285C391.491 75.7917 390.043 76.9369 388.143 77.764C386.252 78.582 383.965 79 381.272 79C378.671 79 376.402 78.6002 374.493 77.8004C372.575 77.0097 371.08 75.8463 370.001 74.3194C368.922 72.7926 368.341 70.9294 368.258 68.7391H374.235C374.318 69.8842 374.687 70.8386 375.314 71.6111C375.95 72.3745 376.78 72.938 377.795 73.3197C378.819 73.6923 379.962 73.8832 381.226 73.8832C382.545 73.8832 383.707 73.6832 384.712 73.2924C385.708 72.9016 386.492 72.3564 387.055 71.6475C387.627 70.9476 387.913 70.1206 387.922 69.1754C387.913 68.312 387.654 67.5939 387.156 67.0304C386.649 66.467 385.948 65.9944 385.053 65.6127C384.15 65.231 383.098 64.8856 381.899 64.5857L378.081 63.6223C375.323 62.9225 373.137 61.8592 371.541 60.4323C369.937 59.0054 369.143 57.115 369.143 54.7429C369.143 52.798 369.678 51.0894 370.758 49.6261C371.827 48.1629 373.294 47.0268 375.148 46.2179C377.011 45.4 379.114 45 381.456 45C383.836 45 385.92 45.4 387.719 46.2179C389.517 47.0268 390.929 48.1538 391.952 49.5897C392.976 51.0257 393.511 52.6707 393.539 54.5338H387.691Z"
      fill="currentColor"
    />
  </svg>
);

const Shadcnui = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 256 256">
    <path fill="none" d="M0 0h256v256H0z" />
    <path
      fill="none"
      stroke="#fff"
      strokeWidth="25"
      strokeLinecap="round"
      d="M208 128l-80 80M192 40L40 192"
    />
  </svg>
);

const Prisma = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 256 310" preserveAspectRatio="xMidYMid">
    <path
      fill="#fff"
      d="M254.313 235.519L148 9.749A17.063 17.063 0 00133.473.037a16.87 16.87 0 00-15.533 8.052L2.633 194.848a17.465 17.465 0 00.193 18.747L59.2 300.896a18.13 18.13 0 0020.363 7.489l163.599-48.392a17.929 17.929 0 0011.26-9.722 17.542 17.542 0 00-.101-14.76l-.008.008zm-23.802 9.683l-138.823 41.05c-4.235 1.26-8.3-2.411-7.419-6.685l49.598-237.484c.927-4.443 7.063-5.147 9.003-1.035l91.814 194.973a6.63 6.63 0 01-4.18 9.18h.007z"
    />
  </svg>
);

const BetterAuth = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="none" viewBox="0 0 500 500">
    <path fill="#fff" d="M0 0h500v500H0z" />
    <path fill="#000" d="M69 121h86.988v259H69zM337.575 121H430v259h-92.425z" />
    <path
      fill="#000"
      d="M427.282 121v83.456h-174.52V121zM430 296.544V380H252.762v-83.456z"
    />
    <path fill="#000" d="M252.762 204.455v92.089h-96.774v-92.089z" />
  </svg>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-background animate-in fade-in duration-1000">
      {/* Hero Section - Mobile Optimized */}
      <section className="relative min-h-screen flex items-center py-12 sm:py-16 lg:py-24 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left Side - Content */}
            <div className="space-y-6 sm:space-y-8 lg:space-y-10 text-center lg:text-left animate-in slide-in-from-left duration-1000 delay-200">
              <div className="space-y-4 sm:space-y-6">
                <Badge variant="outline" className="w-fit px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium mx-auto lg:mx-0 transition-all hover:scale-105 animate-in fade-in duration-1000 delay-300">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  NextJS BetterAuth Stripe Shadcnui Starter Kit
            </Badge>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.9] tracking-tight animate-in slide-in-from-bottom duration-1000 delay-400">
                  Build
                  <br />
                  <span className="text-muted-foreground">Succeed</span>
            </h1>
                <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-lg leading-relaxed mx-auto lg:mx-0 animate-in fade-in duration-1000 delay-500">
                  The complete NextJS BetterAuth Stripe Shadcnui starter kit for modern SaaS applications. 
                  From authentication to payments, we&apos;ve got you covered.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start animate-in slide-in-from-bottom duration-1000 delay-600">
                <Button size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 h-auto group transition-all duration-300 hover:scale-105" asChild>
                <Link href="/auth/signup">
                    Start Building
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 h-auto transition-all duration-300 hover:scale-105"
                  onClick={() => {
                    // Show toast notification
                    if (typeof window !== 'undefined') {
                      // Import toast dynamically to avoid SSR issues
                      import('sonner').then(({ toast }) => {
                        toast.info('Please login to start the demo', {
                          description: 'Sign in to access the demo features',
                          duration: 4000,
                        });
                      });
                    }
                  }}
                >
                  Start Demo
              </Button>
              </div>
            </div>

            {/* Right Side - Built With Technologies */}
            <div className="relative mt-8 lg:mt-0 flex items-center justify-center animate-in slide-in-from-right duration-1000 delay-700">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
                {/* Circle Perimeter */}
                <div className="absolute inset-0 border-2 border-primary/20 rounded-full animate-spin-slow"></div>
                
                {/* Animated Text in Center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="relative h-8 sm:h-10 lg:h-12">
                      <span className="absolute inset-0 flex items-center justify-center text-lg sm:text-xl lg:text-2xl font-bold text-primary animate-text-cycle-1">
                        Next.js
                      </span>
                      <span className="absolute inset-0 flex items-center justify-center text-lg sm:text-xl lg:text-2xl font-bold text-primary animate-text-cycle-2">
                        shadcn/ui
                      </span>
                      <span className="absolute inset-0 flex items-center justify-center text-lg sm:text-xl lg:text-2xl font-bold text-primary animate-text-cycle-3">
                        Prisma
                      </span>
                      <span className="absolute inset-0 flex items-center justify-center text-lg sm:text-xl lg:text-2xl font-bold text-primary animate-text-cycle-4">
                        Better Auth
                      </span>
                    </div>
                    <p className="text-sm sm:text-base text-muted-foreground mt-2 animate-pulse">
                      Built with
                    </p>
                  </div>
                </div>
                
                {/* Rotating Container with Counter-Rotating Icons */}
                <div className="absolute inset-0 animate-spin-slow">
                  {/* Next.js - Top */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center shadow-lg animate-spin-counter">
                      <Nextjs className="w-6 h-2 sm:w-8 sm:h-3" />
                    </div>
                  </div>
                  
                  {/* Shadcn/ui - Right */}
                  <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center shadow-lg animate-spin-counter">
                      <Shadcnui className="w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                  </div>
                  
                  {/* Prisma - Bottom */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center shadow-lg animate-spin-counter">
                      <Prisma className="w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                  </div>
                  
                  {/* Better Auth - Left */}
                  <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center shadow-lg animate-spin-counter">
                      <BetterAuth className="w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Showcase - Interactive Timeline */}
      <section className="py-20 sm:py-24 lg:py-32 bg-gradient-to-br from-background via-muted/5 to-background relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-16 sm:mb-20 lg:mb-24">
            <Badge variant="outline" className="mb-6 bg-primary/10 border-primary/20 text-primary">
              <Layers className="w-4 h-4 mr-2" />
              Technology Stack
            </Badge>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Built for Modern Development
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A carefully curated stack of cutting-edge technologies that work seamlessly together
            </p>
          </div>

          {/* Interactive Tech Timeline */}
          <div className="max-w-6xl mx-auto">
            <div className="relative">
              {/* Central Timeline Line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/50 to-primary transform -translate-x-1/2 hidden lg:block"></div>
              
              {/* Tech Items */}
              <div className="space-y-16 lg:space-y-24">
                {/* Next.js */}
                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
                  <div className="lg:w-1/2 lg:pr-16 text-center lg:text-right">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-3xl mb-6 shadow-lg">
                      <Nextjs className="w-10 h-4 text-blue-500" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold mb-4">Next.js 15</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      The React framework for production with App Router, Server Components, and built-in TypeScript support.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4 justify-center lg:justify-end">
                      <Badge variant="secondary" className="text-xs">App Router</Badge>
                      <Badge variant="secondary" className="text-xs">Server Components</Badge>
                      <Badge variant="secondary" className="text-xs">TypeScript</Badge>
                    </div>
                  </div>
                  <div className="lg:w-1/2 lg:pl-16">
                    <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-muted-foreground">Live Performance</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Build Speed</span>
                          <span className="text-sm font-semibold text-green-500">2.3x faster</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Bundle Size</span>
                          <span className="text-sm font-semibold text-green-500">-40% smaller</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">SEO Score</span>
                          <span className="text-sm font-semibold text-green-500">100/100</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Better Auth */}
                <div className="flex flex-col lg:flex-row-reverse items-center gap-8 lg:gap-16">
                  <div className="lg:w-1/2 lg:pl-16 text-center lg:text-left">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-3xl mb-6 shadow-lg">
                      <Shield className="w-10 h-10 text-green-500" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold mb-4">Better Auth</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Modern authentication library with email, social login, and advanced security features built-in.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4 justify-center lg:justify-start">
                      <Badge variant="secondary" className="text-xs">OAuth</Badge>
                      <Badge variant="secondary" className="text-xs">2FA</Badge>
                      <Badge variant="secondary" className="text-xs">Session Management</Badge>
                    </div>
                  </div>
                  <div className="lg:w-1/2 lg:pr-16">
                    <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-muted-foreground">Security Features</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Encryption</span>
                          <span className="text-sm font-semibold text-blue-500">AES-256</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Session Security</span>
                          <span className="text-sm font-semibold text-blue-500">JWT + HTTPOnly</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Rate Limiting</span>
                          <span className="text-sm font-semibold text-blue-500">Built-in</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stripe */}
                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
                  <div className="lg:w-1/2 lg:pr-16 text-center lg:text-right">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-3xl mb-6 shadow-lg">
                      <CreditCard className="w-10 h-10 text-purple-500" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold mb-4">Stripe Payments</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Complete payment infrastructure with subscriptions, webhooks, and global payment methods.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4 justify-center lg:justify-end">
                      <Badge variant="secondary" className="text-xs">Subscriptions</Badge>
                      <Badge variant="secondary" className="text-xs">Webhooks</Badge>
                      <Badge variant="secondary" className="text-xs">Global</Badge>
                    </div>
                  </div>
                  <div className="lg:w-1/2 lg:pl-16">
                    <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-muted-foreground">Payment Processing</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Success Rate</span>
                          <span className="text-sm font-semibold text-purple-500">99.9%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Currencies</span>
                          <span className="text-sm font-semibold text-purple-500">135+</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Countries</span>
                          <span className="text-sm font-semibold text-purple-500">40+</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Prisma */}
                <div className="flex flex-col lg:flex-row-reverse items-center gap-8 lg:gap-16">
                  <div className="lg:w-1/2 lg:pl-16 text-center lg:text-left">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-3xl mb-6 shadow-lg">
                      <Prisma className="w-10 h-10 text-orange-500" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold mb-4">Prisma ORM</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Type-safe database access with migrations, seeding, and multi-provider support for any database.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4 justify-center lg:justify-start">
                      <Badge variant="secondary" className="text-xs">Type Safety</Badge>
                      <Badge variant="secondary" className="text-xs">Migrations</Badge>
                      <Badge variant="secondary" className="text-xs">Multi-DB</Badge>
                    </div>
                  </div>
                  <div className="lg:w-1/2 lg:pr-16">
                    <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-muted-foreground">Database Performance</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Query Speed</span>
                          <span className="text-sm font-semibold text-orange-500">3x faster</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Type Safety</span>
                          <span className="text-sm font-semibold text-orange-500">100%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Database Support</span>
                          <span className="text-sm font-semibold text-orange-500">10+</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* shadcn/ui */}
                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
                  <div className="lg:w-1/2 lg:pr-16 text-center lg:text-right">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-500/20 to-pink-600/10 rounded-3xl mb-6 shadow-lg">
                      <Shadcnui className="w-10 h-10 text-pink-500" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold mb-4">shadcn/ui</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Beautiful, accessible UI components with dark mode, custom theming, and copy-paste installation.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4 justify-center lg:justify-end">
                      <Badge variant="secondary" className="text-xs">Accessible</Badge>
                      <Badge variant="secondary" className="text-xs">Customizable</Badge>
                      <Badge variant="secondary" className="text-xs">Dark Mode</Badge>
                    </div>
                  </div>
                  <div className="lg:w-1/2 lg:pl-16">
                    <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-lg">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-muted-foreground">UI Components</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Components</span>
                          <span className="text-sm font-semibold text-pink-500">50+</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Accessibility</span>
                          <span className="text-sm font-semibold text-pink-500">WCAG 2.1</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Bundle Size</span>
                          <span className="text-sm font-semibold text-pink-500">Tree-shakeable</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Mobile Optimized */}
      <section id="pricing" className="py-20 sm:py-24 lg:py-32 bg-gradient-to-br from-background via-muted/5 to-background relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-primary/5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <div className="inline-flex items-center justify-center mb-4 sm:mb-6">
              <Badge variant="outline" className="text-xs sm:text-sm font-medium px-3 sm:px-4 py-1.5 sm:py-2 border-primary/20 bg-primary/5 transition-all duration-300 hover:scale-105">
                <CreditCard className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Pricing Plans
              </Badge>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent transition-all duration-300">
              Choose Your
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Perfect Plan
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Start free, scale as you grow. All plans include our core features with no hidden fees.
            </p>
          </div>

          {/* Pricing Cards - Mobile Optimized */}
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-6">
                      {PRICING_PLANS.map((plan) => (
                <div key={plan.id} className={`relative group ${
                  plan.popular ? 'lg:-mt-8 lg:mb-8' : ''
                }`}>
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <Badge className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-6 py-2 text-sm font-semibold shadow-lg">
                        <Star className="w-4 h-4 mr-2" />
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  {/* Card */}
                  <div className={`relative h-full transition-all duration-500 group-hover:scale-105 ${
                    plan.popular 
                      ? 'bg-gradient-to-br from-primary/10 via-primary/5 to-background border-2 border-primary/30 shadow-2xl' 
                      : 'bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-xl'
                  } rounded-3xl overflow-hidden`}>
                    
                    {/* Header Section */}
                    <div className="p-6 sm:p-8 pb-4 sm:pb-6">
                      <div className="text-center space-y-4 sm:space-y-6">
                        {/* Plan Name */}
                        <div className="space-y-2">
                          <h3 className="text-2xl sm:text-3xl font-bold text-foreground">{plan.name}</h3>
                          <p className="text-sm sm:text-base text-muted-foreground">{plan.description}</p>
                        </div>

                        {/* Price */}
                        <div className="space-y-2">
                          <div className="flex items-baseline justify-center">
                            <span className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground">${plan.price}</span>
                            <span className="text-muted-foreground text-lg sm:text-xl ml-2">/{plan.interval}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Features Section */}
                    <div className="px-6 sm:px-8 pb-6 sm:pb-8">
                      <ul className="space-y-3 sm:space-y-4 lg:space-y-5 mb-6 sm:mb-8 lg:mb-10">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center space-x-3 sm:space-x-4">
                            <div className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                              plan.popular ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'
                            }`}>
                              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                            </div>
                            <span className="text-foreground font-medium text-sm sm:text-base">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {/* CTA Button */}
                      <StripeCheckout 
                        priceId={plan.stripePriceId || ""}
                        planName={plan.name}
                        isPopular={plan.popular}
                      >
                        Get Started
                      </StripeCheckout>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Info */}
          <div className="text-center mt-20">
            <div className="inline-flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>No setup fees</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>24/7 support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Professional */}
      <section className="py-20 sm:py-24 lg:py-32 bg-gradient-to-br from-primary via-primary to-primary/90 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            

            {/* Contact Information */}
            <div className=" p-8 sm:p-10 max-w-2xl mx-auto">
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl sm:text-3xl font-bold text-primary-foreground mb-2">
                    Need Custom Development?
                  </h3>
                  <p className="text-primary-foreground/80 text-lg">
                    Let&apos;s discuss your project requirements
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
                  <a 
                    href="https://shovon.site" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 hover:bg-white/30 text-primary-foreground font-semibold rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    <Globe className="w-5 h-5" />
                    shovon.site
                  </a>
                  
                  <a 
                    href="mailto:contact@shovon.site" 
                    className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 hover:bg-white/30 text-primary-foreground font-semibold rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    <MessageSquare className="w-5 h-5" />
                    minar.svn@gmail.com
                  </a>
                </div>
                
          <div className="text-center">
                  <p className="text-primary-foreground/70 text-sm">
                    Available for consulting, custom development, and enterprise solutions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}