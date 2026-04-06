"use client";

import Link from "next/link";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Provider } from "@supabase/supabase-js";
import toast from "react-hot-toast";
import config from "@/config";

export default function Login() {
  const supabase = createClientComponentClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async (
    e: any,
    options: {
      type: string;
      provider?: Provider;
    }
  ) => {
    e?.preventDefault();

    setIsLoading(true);

    try {
      const { type, provider } = options;
      const redirectURL = window.location.origin + "/api/auth/callback";

      if (type === "oauth") {
        await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: redirectURL,
          },
        });
      }

      else if (type === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username,
            },
            emailRedirectTo: redirectURL,
          },
        });

        if (error) throw error;

        toast.success("Account created! Check your email");
      }

      else if (type === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast.success("Welcome back!");
        window.location.href = "/dashboard";
      }

    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="p-8 md:p-24" data-theme={config.colors.theme}>
      <div className="text-center mb-4">
        <Link href="/" className="btn btn-ghost btn-sm">
          ← Home
        </Link>
      </div>

      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-center mb-12">
        {isSignup ? "Create Account" : "Sign In"} to {config.appName}
      </h1>

      <div className="space-y-8 max-w-xl mx-auto">

        {/* Google Login */}
        <button
          className="btn btn-block"
          onClick={(e) =>
            handleAuth(e, { type: "oauth", provider: "google" })
          }
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            "Continue with Google"
          )}
        </button>

        <div className="divider text-xs text-base-content/50 font-medium">
          OR
        </div>

        {/* Form */}
        <form
          className="form-control w-full space-y-4"
          onSubmit={(e) =>
            handleAuth(e, {
              type: isSignup ? "signup" : "signin",
            })
          }
        >

          {isSignup && (
            <input
              required
              type="text"
              value={username}
              placeholder="Username"
              className="input input-bordered w-full"
              onChange={(e) => setUsername(e.target.value)}
            />
          )}

          <input
            required
            type="email"
            value={email}
            placeholder="Email"
            className="input input-bordered w-full"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            required
            type="password"
            value={password}
            placeholder="Password"
            className="input input-bordered w-full"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="btn btn-primary btn-block"
            disabled={isLoading}
            type="submit"
          >
            {isLoading && (
              <span className="loading loading-spinner loading-xs"></span>
            )}

            {isSignup ? "Create Account" : "Sign In"}
          </button>
        </form>

        {/* Toggle */}
        <div className="text-center text-sm">
          {isSignup
            ? "Already have an account?"
            : "Don't have an account?"}

          <button
            className="ml-2 link"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? "Sign In" : "Create Account"}
          </button>
        </div>

      </div>
    </main>
  );
}
