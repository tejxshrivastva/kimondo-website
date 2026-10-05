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
      const result = await signIn("credentials", {
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
    <div className="min-h-screen flex items-center justify-center bg-[#fafaf8]">
      <div className="w-full max-w-[380px] mx-4">
        <div className="text-center mb-10">
          <p className="font-display text-2xl tracking-[0.25em] uppercase">
            Kimondo
          </p>
          <p className="text-[11px] tracking-[0.2em] uppercase text-muted mt-1">
            Content Management System
          </p>
        </div>

        <div className="bg-white border border-[rgba(0,0,0,0.08)] rounded-2xl p-8">
          <h1 className="text-lg font-semibold mb-1">
            {step === "email" ? "Sign in" : "Enter OTP"}
          </h1>
          <p className="text-sm text-muted mb-6">
            {step === "email"
              ? "Enter your admin email to continue"
              : `We sent a code to ${email}`}
          </p>

          {step === "email" ? (
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
                  autoFocus
                  className="w-full text-sm border border-[rgba(0,0,0,0.15)] rounded-lg px-3 py-2.5 focus:outline-none focus:border-black transition-colors"
                />
              </div>
              {error && <p className="text-xs text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={loading || !email}
                className="w-full bg-black text-white text-sm font-medium py-2.5 rounded-lg hover:bg-black/90 transition-colors disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
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
                  className="w-full text-sm border border-[rgba(0,0,0,0.15)] rounded-lg px-3 py-2.5 focus:outline-none focus:border-black transition-colors tracking-[0.3em] text-center font-mono text-lg"
                />
              </div>
              {error && <p className="text-xs text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-black text-white text-sm font-medium py-2.5 rounded-lg hover:bg-black/90 transition-colors disabled:opacity-50"
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
