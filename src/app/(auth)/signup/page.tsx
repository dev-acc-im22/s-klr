"use client";

import { Suspense } from "react";
import { SignupForm } from "@/components/auth/SignupForm";
import Link from "next/link";

function SignupContent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-border p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <h1 className="text-2xl font-bold gradient-text">CreatorHub</h1>
            </Link>
            <p className="text-muted-foreground mt-2">
              Create your creator account
            </p>
          </div>

          {/* Signup Form */}
          <SignupForm />

          {/* Ghost Mode Link */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              Want to explore without signing up?{" "}
              <Link
                href="/dashboard?ghost=true"
                className="text-primary hover:underline"
              >
                Try Ghost Mode
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-900 dark:to-slate-800">
        <div className="animate-pulse">Loading...</div>
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
}
