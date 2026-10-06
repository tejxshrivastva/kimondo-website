"use client";

import { useState } from "react";
import { Send, Check } from "lucide-react";

export default function FounderPage() {
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !email.trim()) return;
    setLoading(true);
    try {
      await fetch("/api/founder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, email }),
      });
    } catch {
      // Best effort
    }
    setLoading(false);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="max-w-[600px] mx-auto px-4 sm:px-6 py-16 lg:py-24 text-center">
        <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center mx-auto mb-6">
          <Check size={24} />
        </div>
        <h1 className="font-display text-3xl mb-3">Message received</h1>
        <p className="text-[#666666]">
          We read every letter. If a reply is needed, it will come from the founder directly.
        </p>
        <button
          onClick={() => {
            setSent(false);
            setMessage("");
            setEmail("");
          }}
          className="mt-8 text-sm font-medium underline underline-offset-4"
        >
          Write another
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[600px] mx-auto px-4 sm:px-6 py-8 lg:py-12">
      <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl mb-2">
        Write to the founder
      </h1>
      <p className="text-[#666666] mb-8">
        A direct line to the person behind the cloth.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Your message..."
          rows={6}
          className="w-full border border-[rgba(0,0,0,0.24)] p-3 text-base resize-none focus:outline-none focus:border-black transition-colors"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          className="w-full border border-[rgba(0,0,0,0.24)] p-3 text-base focus:outline-none focus:border-black transition-colors"
          required
        />
        <button
          type="submit"
          disabled={loading || !message.trim() || !email.trim()}
          className="w-full h-12 bg-black text-white text-sm font-semibold hover:bg-black/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Send size={16} />
          Send message
        </button>
      </form>
    </div>
  );
}
