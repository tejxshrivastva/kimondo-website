"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

type Step = "email" | "otp";

export default function AdminLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    setError("");
    await signIn("google", { callbackUrl: "/admin" });
  }

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        setError("Failed to send OTP. Try again.");
        return;
      }
      setStep("otp");
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await signIn("otp", {
        email,
        otp,
        redirect: false,
      });
      if (result?.error) {
        setError("Invalid OTP or unauthorized access.");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Verification failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f8f8]">
      <div className="w-full max-w-[380px] mx-4">
        <div className="text-center mb-10">
          <p className="font-display text-2xl tracking-[0.25em] uppercase">
            Kimondo
          </p>
          <p className="text-[11px] tracking-[0.2em] uppercase text-muted mt-1">
            Admin
          </p>
        </div>

        <div className="bg-white border border-[rgba(0,0,0,0.12)] p-8">
          <h1 className="text-lg font-semibold mb-1">
            {step === "email" ? "Sign in" : "Enter OTP"}
          </h1>
          <p className="text-sm text-muted mb-6">
            {step === "email"
              ? "Sign in to manage your store"
              : `We sent a code to ${email}`}
          </p>

          {step === "email" ? (
            <>
              <button
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 bg-white border border-[rgba(0,0,0,0.15)] text-sm font-medium py-2.5  hover:bg-[#f8f8f8] transition-colors disabled:opacity-50 mb-5"
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                {googleLoading ? "Redirecting..." : "Continue with Google"}
              </button>

              <div className="relative mb-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[rgba(0,0,0,0.08)]" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-3 text-muted">or</span>
                </div>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted block mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@kimondo.in"
                    required
                    className="w-full text-sm border border-[rgba(0,0,0,0.15)]  px-3 py-2.5 focus:outline-none focus:border-black transition-colors"
                  />
                </div>
                {error && <p className="text-xs text-black">{error}</p>}
                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full bg-black text-white text-sm font-medium py-2.5  hover:bg-black/90 transition-colors disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </form>
            </>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted block mb-1.5">
                  One-time code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  required
                  autoFocus
                  maxLength={6}
                  className="w-full text-sm border border-[rgba(0,0,0,0.15)]  px-3 py-2.5 focus:outline-none focus:border-black transition-colors tracking-[0.3em] text-center font-mono text-lg"
                />
              </div>
              {error && <p className="text-xs text-black">{error}</p>}
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-black text-white text-sm font-medium py-2.5  hover:bg-black/90 transition-colors disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Sign in"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setOtp("");
                  setError("");
                }}
                className="w-full text-sm text-muted hover:text-black transition-colors"
              >
                Use a different email
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-[10px] text-muted mt-6">
          Only authorized admin and editor accounts can sign in.
        </p>
      </div>
    </div>
  );
}
