"use client";

import { useState } from "react";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), phone: phone.trim() }),
      });
      const data = await res.json();
      if (!res.ok && res.status !== 200) {
        setStatus("error");
        setMessage(data.error || "Something went wrong");
        return;
      }
      setStatus("success");
      setMessage(data.message || "You're on the waitlist!");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="space-y-3 py-2">
        <p className="text-sm font-medium">{message}</p>
        <p className="text-xs text-[#666666]">
          You will be notified when Kimondo goes live for sale
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <input
          type="email"
          placeholder="ENTER EMAIL"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border-b border-[rgba(0,0,0,0.24)] pb-2 text-[11px] tracking-[0.15em] uppercase placeholder:text-[#999999] focus:outline-none focus:border-black transition-colors bg-transparent"
        />
      </div>
      <div>
        <input
          type="tel"
          placeholder="ENTER PHONE NUMBER (OPTIONAL)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border-b border-[rgba(0,0,0,0.24)] pb-2 text-[11px] tracking-[0.15em] uppercase placeholder:text-[#999999] focus:outline-none focus:border-black transition-colors bg-transparent"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading" || !email.trim()}
        className="w-full h-12 bg-black text-white text-[11px] font-semibold tracking-[0.2em] uppercase hover:bg-black/90 transition-colors disabled:opacity-50"
      >
        {status === "loading" ? "Joining..." : "Join the waitlist"}
      </button>
      <p className="text-xs text-[#666666]">
        You will be notified when Kimondo goes live for sale
      </p>
      {status === "error" && (
        <p className="text-xs text-red-600">{message}</p>
      )}
    </form>
  );
}
