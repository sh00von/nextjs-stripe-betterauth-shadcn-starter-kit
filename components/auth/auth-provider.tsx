"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/toast";

interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
}

interface Session {
  user: User;
  session: {
    id: string;
    userId: string;
    expiresAt: string;
    token: string;
  };
}

interface AuthContextType {
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // localStorage key for storing auth token
  const AUTH_TOKEN_KEY = 'auth_token';
  const USER_DATA_KEY = 'user_data';

  useEffect(() => {
    const getSession = async () => {
      try {
        // First check localStorage for token
        if (typeof window !== 'undefined') {
          const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);
          const storedUserData = localStorage.getItem(USER_DATA_KEY);
          
          if (storedToken && storedUserData) {
            try {
              const userData = JSON.parse(storedUserData);
              const sessionData = {
                user: userData,
                session: {
                  id: storedToken,
                  userId: userData.id,
                  expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                  token: storedToken,
                }
              };
              setSession(sessionData);
              setLoading(false);
              return;
            } catch (error) {
              console.error("Error parsing stored user data:", error);
              // Clear invalid data
              localStorage.removeItem(AUTH_TOKEN_KEY);
              localStorage.removeItem(USER_DATA_KEY);
            }
          }
        }

        // Fallback to server session check
        const response = await fetch("/api/auth/session", {
          credentials: "include",
        });
        const data = await response.json();
        
        console.log("Session check response:", data);
        
        if (data?.session && data?.user) {
          setSession(data);
        } else if (data?.data?.session && data?.data?.user) {
          setSession(data.data);
        } else {
          setSession(null);
          // If we're on a protected route and no session, redirect to signin
          if (typeof window !== 'undefined' && window.location.pathname.startsWith('/dashboard')) {
            router.push('/auth/signin');
          }
        }
      } catch (error) {
        console.error("Error getting session:", error);
        setSession(null);
      } finally {
        setLoading(false);
      }
    };

    getSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/sign-in/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Sign in failed");
      }

      console.log("Sign in response:", data);

      // Better Auth signInEmail returns user data on success
      if (data?.user) {
        // Create session object from the signin response
        const sessionData = {
          user: data.user,
          session: {
            id: data.token,
            userId: data.user.id,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
            token: data.token,
          }
        };
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem(AUTH_TOKEN_KEY, data.token);
          localStorage.setItem(USER_DATA_KEY, JSON.stringify(data.user));
        }
        
        console.log("Created session from signin response:", sessionData);
        setSession(sessionData);
        showToast.success("Welcome back!");
        router.push("/dashboard");
      } else {
        console.error("No user in response:", data);
        throw new Error("Sign in failed");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Sign in failed";
      showToast.error(errorMessage);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const response = await fetch("/api/auth/sign-up/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Sign up failed");
      }

      console.log("Sign up response:", data);

      // Better Auth signUp returns user data on success
      if (data?.user) {
        // Create session object from the signup response
        const sessionData = {
          user: data.user,
          session: {
            id: data.token,
            userId: data.user.id,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
            token: data.token,
          }
        };
        
        // Save to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem(AUTH_TOKEN_KEY, data.token);
          localStorage.setItem(USER_DATA_KEY, JSON.stringify(data.user));
        }
        
        console.log("Created session from signup response:", sessionData);
        setSession(sessionData);
        showToast.success("Account created successfully!");
        router.push("/dashboard");
      } else {
        console.error("No user in response:", data);
        throw new Error("Sign up failed");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Sign up failed";
      showToast.error(errorMessage);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await fetch("/api/auth/sign-out", {
        method: "POST",
      });
      
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(USER_DATA_KEY);
      }
      
      setSession(null);
      showToast.success("Signed out successfully");
      router.push("/");
    } catch (error) {
      showToast.error("Error signing out");
      console.error("Sign out error:", error);
    }
  };

  const value = {
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
