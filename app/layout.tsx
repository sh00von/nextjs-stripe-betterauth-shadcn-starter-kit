import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/auth-provider";
import { ConditionalNavbar } from "@/components/navigation/conditional-navbar";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SaaS Starter Kit - Build Your SaaS Faster",
  description: "A complete SaaS starter kit with Better Auth, Stripe payments, and shadcn/ui components. Get your SaaS up and running in minutes.",
  keywords: ["SaaS", "starter kit", "Next.js", "Stripe", "authentication", "shadcn/ui"],
  authors: [{ name: "SaaS Starter Kit" }],
  openGraph: {
    title: "SaaS Starter Kit",
    description: "Build your SaaS faster with our complete starter kit",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <ConditionalNavbar />
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
