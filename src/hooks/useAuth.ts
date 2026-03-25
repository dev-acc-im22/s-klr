"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";

interface UseAuthOptions {
  /**
   * Where to redirect after successful login
   */
  callbackUrl?: string;
  /**
   * Whether to redirect automatically when unauthenticated
   */
  redirectToLogin?: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupData {
  name: string;
  email: string;
  username: string;
  password: string;
}

export function useAuth(options: UseAuthOptions = {}) {
  const { callbackUrl = "/dashboard", redirectToLogin = false } = options;
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = status === "authenticated";
  const isUnauthenticated = status === "unauthenticated";
  const isLoadingAuth = status === "loading";

  // Redirect if needed
  if (redirectToLogin && isUnauthenticated && !isLoadingAuth) {
    router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await signIn("credentials", {
          email: credentials.email,
          password: credentials.password,
          redirect: false,
        });

        if (result?.error) {
          setError("Invalid email or password. Please try again.");
          return { success: false, error: result.error };
        }

        router.push(callbackUrl);
        router.refresh();
        return { success: true };
      } catch (err) {
        const errorMessage = "An unexpected error occurred. Please try again.";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [callbackUrl, router]
  );

  const signup = useCallback(async (data: SignupData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "An error occurred. Please try again.");
        return { success: false, error: result.error };
      }

      return { success: true, user: result.user };
    } catch (err) {
      const errorMessage = "An unexpected error occurred. Please try again.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await signOut({ redirect: false });
    router.push("/");
    router.refresh();
  }, [router]);

  const loginWithGoogle = useCallback(async () => {
    await signIn("google", { callbackUrl });
  }, [callbackUrl]);

  return {
    // Session data
    session,
    user: session?.user,
    status,
    
    // Auth states
    isAuthenticated,
    isUnauthenticated,
    isLoadingAuth,
    isLoading,
    error,
    
    // Auth actions
    login,
    signup,
    logout,
    loginWithGoogle,
    updateSession: update,
    clearError: () => setError(null),
  };
}
