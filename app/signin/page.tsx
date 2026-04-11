"use client";

import Link from "next/link";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import toast from "react-hot-toast";
import config from "@/config";

export default function Login() {
  const supabase = createClientComponentClient();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const redirectURL = window.location.origin + "/api/auth/callback";
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectURL,
        },
      });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-base-200 p-4" data-theme={config.colors.theme}>
      
      {/* The White Card */}
      <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full text-center border border-gray-100">
        
        <h1 className="text-xl font-bold text-gray-800 mb-6">
          Create an account or sign in
        </h1>

        <div className="space-y-4">
          {/* Google Button */}
          <button
            className="btn btn-block bg-white hover:bg-gray-50 text-gray-700 border-gray-300 normal-case font-medium flex items-center justify-center gap-3"
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
                <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
              </svg>
            )}
            Sign in with Google
          </button>
        </div>

        {/* Social Proof Section */}
        <div className="mt-6 text-left space-y-2 text-sm text-gray-600 border-t border-gray-100 pt-6">
          <p className="flex items-center gap-2">
            ✅ <span className="font-medium">Used by 1k+ users</span>
          </p>
          <p className="flex items-center gap-2">
            ⭐ <span className="font-medium">5-star reviews on G2 & Capterra</span>
          </p>
          <p className="flex items-center gap-2">
            💰 <span className="font-medium">14-day money-back guarantee</span>
          </p>
        </div>

        {/* Terms and Conditions Only */}
        <div className="mt-8 text-[11px] text-gray-400 leading-relaxed">
          By proceeding, you agree to the{" "}
          <Link href="/terms" className="underline hover:text-gray-600">Terms and Conditions</Link>{" "}
          and <Link href="/privacy" className="underline hover:text-gray-600">Privacy Policy</Link>
        </div>

      </div>
    </main>
  );
}
