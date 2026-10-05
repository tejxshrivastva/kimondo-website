"use client";

import { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { signIn } from "next-auth/react";
import { useOverlayStore } from "@/store/overlay-store";

type Step = "choose" | "otp" | "success";

export function AuthDrawer() {
  const { authOpen, closeAuth, pendingAction } = useOverlayStore();
  const [step, setStep] = useState<Step>("choose");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpLeft, setOtpLeft] = useState(30);
  const [loading, setLoading] = useState(false);
  const [hasGoogle, setHasGoogle] = useState(false);

  useEffect(() => {
    fetch("/api/auth/providers")
      .then((r) => r.json())
      .then((d) => setHasGoogle(!!d.google))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!authOpen) {
      setStep("choose");
      setEmail("");
      setOtp("");
      setOtpLeft(30);
    }
  }, [authOpen]);

  useEffect(() => {
    if (step !== "otp") return;
    const interval = setInterval(() => {
      setOtpLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  const handleSendOtp = async () => {
    if (!email.trim()) return;
    setLoading(true);
    await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    setStep("otp");
    setOtpLeft(30);
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return;
    setLoading(true);
    const result = await signIn("otp", {
      email,
      otp,
      redirect: false,
    });
    setLoading(false);
    if (result?.ok) {
      setStep("success");
      setTimeout(() => {
        closeAuth();
        pendingAction?.();
      }, 1200);
    }
  };

  const handleGoogle = () => {
    signIn("google", { callbackUrl: window.location.href });
  };

  if (!authOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-[70]"
        onClick={closeAuth}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-[430px] bg-white z-[70] shadow-xl animate-slide-in flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-[rgba(0,0,0,0.1)]">
          <h2 className="font-display text-xl">
            {step === "success" ? "" : "Sign in"}
          </h2>
          <button onClick={closeAuth} className="p-2">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          {step === "choose" && (
            <div className="space-y-6">
              <p className="font-body text-muted-foreground">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>

              {hasGoogle && (
                <>
                  <button
                    onClick={handleGoogle}
                    className="w-full h-12 border border-[rgba(0,0,0,0.24)] rounded-[12px] text-sm font-medium flex items-center justify-center gap-3 hover:bg-surface transition-colors"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
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
                    Continue with Google
                  </button>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-[rgba(0,0,0,0.1)]" />
                    <span className="text-xs text-muted">or</span>
                    <div className="flex-1 h-px bg-[rgba(0,0,0,0.1)]" />
                  </div>
                </>
              )}

              <div className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="w-full border border-[rgba(0,0,0,0.24)] rounded-[12px] p-3 text-base focus:outline-none focus:border-black transition-colors"
                  onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                />
                <button
                  onClick={handleSendOtp}
                  disabled={loading || !email.trim()}
                  className="w-full h-12 bg-black text-white text-sm font-semibold rounded-[12px] hover:bg-black/90 transition-colors disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </div>

              <p className="text-xs text-muted text-center">
                Lorem ipsum dolor sit amet.
              </p>
            </div>
          )}

          {step === "otp" && (
            <div className="space-y-6">
              <p className="font-body text-muted-foreground">
                Enter the 6-digit code sent to{" "}
                <span className="text-foreground font-medium">{email}</span>
              </p>

              <input
                type="text"
                value={otp}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setOtp(val);
                }}
                placeholder="000000"
                maxLength={6}
                className="w-full text-center text-3xl tracking-[0.5em] border border-[rgba(0,0,0,0.24)] rounded-[12px] p-4 focus:outline-none focus:border-black transition-colors font-mono"
                autoFocus
              />

              {otpLeft > 0 ? (
                <p className="text-sm text-muted text-center">
                  Resend in {otpLeft}s
                </p>
              ) : (
                <button
                  onClick={handleSendOtp}
                  className="text-sm font-medium underline underline-offset-4 block mx-auto"
                >
                  Resend code
                </button>
              )}

              <button
                onClick={handleVerifyOtp}
                disabled={loading || otp.length !== 6}
                className="w-full h-12 bg-black text-white text-sm font-semibold rounded-[12px] hover:bg-black/90 transition-colors disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify & continue"}
              </button>
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center mb-6">
                <Check size={32} />
              </div>
              <h3 className="font-display text-2xl mb-2">You&apos;re in</h3>
              <p className="text-sm text-muted">{email}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
