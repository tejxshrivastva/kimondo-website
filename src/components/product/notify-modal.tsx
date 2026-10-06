"use client";

import { useState } from "react";
import { X, Bell } from "lucide-react";
import { useOverlayStore } from "@/store/overlay-store";
import { toast } from "sonner";

export function NotifyModal() {
  const { notifyOpen, notifyVariantId, closeNotify } = useOverlayStore();
  const [loading, setLoading] = useState(false);

  if (!notifyOpen || !notifyVariantId) return null;

  const handleNotify = async () => {
    setLoading(true);
    const res = await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ variantId: notifyVariantId }),
    });
    setLoading(false);

    if (res.ok) {
      toast("We'll notify you when this is back in stock");
      closeNotify();
    } else {
      const data = await res.json();
      if (data.error === "Unauthorized") {
        toast.error("Please sign in first");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-[80]" onClick={closeNotify} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[360px] bg-white z-[80] p-6 animate-fade-in">
        <button onClick={closeNotify} className="absolute top-4 right-4 p-1">
          <X size={18} />
        </button>
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-[#f8f8f8] flex items-center justify-center mb-4">
            <Bell size={24} />
          </div>
          <h3 className="font-display text-lg mb-2">Notify me</h3>
          <p className="text-sm text-muted mb-6">
            This size is currently unavailable. We will email you when it returns.
          </p>
          <button
            onClick={handleNotify}
            disabled={loading}
            className="w-full h-12 bg-black text-white text-sm font-semibold  disabled:opacity-50"
          >
            {loading ? "Saving..." : "Notify me"}
          </button>
        </div>
      </div>
    </>
  );
}
