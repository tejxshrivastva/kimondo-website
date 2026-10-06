"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useOverlayStore } from "@/store/overlay-store";

export function ReturnForm() {
  const { returnFormOpen, returnOrderId, returnType, closeReturnForm } =
    useOverlayStore();
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!returnFormOpen) return null;

  const title =
    returnType === "exchange" ? "Request an exchange" : "Request a return";

  const handleSubmit = async () => {
    if (!reason.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/user/return-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: returnOrderId,
          type: returnType,
          reason: reason.trim(),
        }),
      });
      if (res.ok) {
        toast("Request submitted");
        setReason("");
        closeReturnForm();
      } else {
        toast.error("Something went wrong");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40"
        onClick={closeReturnForm}
      />
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white  w-full max-w-[420px] p-6 pointer-events-auto ">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg">{title}</h2>
            <button
              onClick={closeReturnForm}
              className="p-1 text-muted hover:text-black"
            >
              <X size={18} />
            </button>
          </div>

          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Describe the reason for your return or exchange."
            rows={4}
            className="w-full border border-[rgba(0,0,0,0.16)]  p-3 text-sm resize-none focus:outline-none focus:border-black"
          />

          <button
            onClick={handleSubmit}
            disabled={submitting || !reason.trim()}
            className="mt-4 w-full h-11 bg-black text-white text-sm font-semibold  disabled:opacity-40"
          >
            {submitting ? "Submitting..." : "Submit request"}
          </button>
        </div>
      </div>
    </>
  );
}
