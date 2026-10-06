"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const STATUS_FLOW: Record<string, { next: string; label: string }[]> = {
  confirmed: [{ next: "accepted", label: "Accept order" }],
  accepted: [{ next: "processed", label: "Mark as processed" }],
  processed: [{ next: "shipped", label: "Mark as shipped" }],
  return_requested: [{ next: "return_approved", label: "Approve return" }],
  return_approved: [{ next: "reverse_pickup_scheduled", label: "Schedule pickup" }],
  reverse_pickup_scheduled: [{ next: "return_received", label: "Mark received" }],
  return_received: [{ next: "refunded", label: "Mark refunded" }],
  exchange_requested: [{ next: "exchange_approved", label: "Approve exchange" }],
  exchange_approved: [{ next: "exchange_dispatched", label: "Dispatch exchange" }],
  exchange_dispatched: [{ next: "exchange_complete", label: "Mark complete" }],
};

export function OrderActions({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);
  const [trackingRef, setTrackingRef] = useState("");
  const actions = STATUS_FLOW[currentStatus] || [];

  if (actions.length === 0) return null;

  const needsTracking = currentStatus === "processed";

  const handleUpdate = async (newStatus: string) => {
    if (needsTracking && !trackingRef.trim()) {
      toast.error("Tracking reference is required");
      return;
    }
    setUpdating(true);
    const body: Record<string, string> = { status: newStatus };
    if (needsTracking) body.trackingRef = trackingRef.trim();

    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setUpdating(false);
    if (res.ok) {
      toast("Order updated");
      router.refresh();
    } else {
      toast.error("Failed to update");
    }
  };

  return (
    <div>
      <h2 className="text-sm font-semibold tracking-[0.1em] uppercase mb-3">
        Actions
      </h2>
      {needsTracking && (
        <div className="mb-3">
          <label className="text-xs font-medium text-muted block mb-1">Tracking reference</label>
          <input
            value={trackingRef}
            onChange={(e) => setTrackingRef(e.target.value)}
            placeholder="Enter tracking number"
            className="w-full max-w-[300px] border border-[rgba(0,0,0,0.16)] p-3 text-sm focus:outline-none focus:border-black"
          />
        </div>
      )}
      <div className="flex gap-2">
        {actions.map(({ next, label }) => (
          <button
            key={next}
            onClick={() => handleUpdate(next)}
            disabled={updating}
            className="h-10 px-4 bg-black text-white text-sm font-semibold disabled:opacity-50"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
