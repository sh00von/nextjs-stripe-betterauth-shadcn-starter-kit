"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/auth-provider";

interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  subscription: {
    id: string;
    userId: string;
    stripeCustomerId: string | null;
    stripeSubscriptionId: string | null;
    stripePriceId: string | null;
    stripeStatus: string | null;
    stripeCurrentPeriodEnd: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
  stats: {
    totalSessions: number;
    totalAccounts: number;
  };
}

interface UseProfileReturn {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateProfile: (data: { name?: string; image?: string }) => Promise<boolean>;
}

export function useProfile(): UseProfileReturn {
  const { session } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    if (!session?.user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get user data from localStorage for fallback
      const userData = localStorage.getItem('user_data');
      const parsedUserData = userData ? JSON.parse(userData) : null;

      const response = await fetch("/api/profile/me", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userData: parsedUserData }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      setProfile(data.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: { name?: string; image?: string }): Promise<boolean> => {
    try {
      setError(null);

      const response = await fetch("/api/profile/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const result = await response.json();
      setProfile(result.user);
      
      // Update localStorage with new user data
      if (typeof window !== 'undefined') {
        const currentUserData = localStorage.getItem('user_data');
        if (currentUserData) {
          const parsedUserData = JSON.parse(currentUserData);
          const updatedUserData = { ...parsedUserData, ...data };
          localStorage.setItem('user_data', JSON.stringify(updatedUserData));
        }
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error updating profile:", err);
      return false;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [session]);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
    updateProfile,
  };
}
