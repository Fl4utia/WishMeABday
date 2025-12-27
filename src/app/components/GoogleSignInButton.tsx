/**
 * Google Sign-In Button Component
 */
"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithGoogle } from "@/lib/utils/auth";
import { ROUTES } from "@/lib/constants/routes";

interface GoogleSignInButtonProps {
  redirectTo?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export default function GoogleSignInButton({
  redirectTo = ROUTES.CARDS,
  onSuccess,
  onError,
}: GoogleSignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");

    try {
      const user = await signInWithGoogle();

      if (user) {
        console.log("User signed in successfully:", user.uid);
        
        if (onSuccess) {
          onSuccess();
        }
        
        router.push(redirectTo);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred during Google login";
      console.error("Sign-in error:", err);
      setError(errorMessage);
      
      if (onError && err instanceof Error) {
        onError(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {error && (
        <p className="text-red-500 text-sm mb-3 text-center" role="alert">
          {error}
        </p>
      )}

      <div className="border rounded-md">
        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="flex items-center justify-center w-full text-black font-bold py-3 px-4 rounded-lg transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Sign in with Google"
        >
          <Image
            src="/google.svg"
            alt="Google"
            width={20}
            height={20}
            className="mr-2"
          />
          {isLoading ? "Signing in..." : "Sign in with Google"}
        </button>
      </div>
    </div>
  );
}
