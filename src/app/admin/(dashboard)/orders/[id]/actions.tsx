"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const STATUS_FLOW: Record<string, string[]> = {
  confirmed: ["processing"],
  processing: ["shipped"],
  shipped: ["in_transit"],
  in_transit: ["out_for_delivery"],
  out_for_delivery: ["delivered"],
  return_requested: ["return_approved"],
  return_approved: ["return_picked"],
  return_picked: ["return_completed", "refunded"],
  exchange_requested: ["exchange_approved"],
  exchange_approved: ["exchange_shipped"],
  exchange_shipped: ["exchange_delivered"],
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
  const nextStatuses = STATUS_FLOW[currentStatus] || [];

  if (nextStatuses.length === 0) return null;

  const handleUpdate = async (newStatus: string) => {
    setUpdating(true);
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
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
      <div className="flex gap-2">
        {nextStatuses.map((status) => (
          <button
            key={status}
            onClick={() => handleUpdate(status)}
            disabled={updating}
            className="h-10 px-4 bg-black text-white text-sm font-semibold rounded-[12px] disabled:opacity-50 capitalize"
          >
            Mark as {status.replace(/_/g, " ")}
          </button>
        ))}
      </div>
    </div>
  );
}
