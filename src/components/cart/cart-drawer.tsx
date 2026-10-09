"use client";

import { useState, useCallback } from "react";
import { X, Plus, Minus, ShoppingBag, MapPin, Loader2 } from "lucide-react";
import Link from "next/link";
import { useOverlayStore } from "@/store/overlay-store";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";

function PincodeEstimator() {
  const [pincode, setPincode] = useState("");
  const [estimate, setEstimate] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const checkPincode = useCallback(async () => {
    if (pincode.length !== 6) return;
    setLoading(true);
    setError(null);
    setEstimate(null);
    try {
      const res = await fetch(`/api/shipping/estimate?pincode=${pincode}`);
      const data = await res.json();
      if (data.serviceable) {
        setEstimate(`Delivery in ${data.estimatedDays || "3–7"} days`);
      } else {
        setError("Not serviceable at this pincode");
      }
    } catch {
      setError("Could not check delivery");
    } finally {
      setLoading(false);
    }
  }, [pincode]);

  return (
    <div className="space-y-1.5">
      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-2 border border-[rgba(0,0,0,0.16)] px-3 h-9">
          <MapPin size={14} className="text-muted shrink-0" />
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
            onKeyDown={(e) => e.key === "Enter" && checkPincode()}
            className="flex-1 text-sm bg-transparent outline-none"
          />
        </div>
        <button
          onClick={checkPincode}
          disabled={pincode.length !== 6 || loading}
          className="h-9 px-4 text-xs font-semibold uppercase tracking-wider border border-black disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : "Check"}
        </button>
      </div>
      {estimate && <p className="text-xs text-[#666666]">{estimate}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function CartDrawer() {
  const { cartOpen, closeCart } = useOverlayStore();
  const { lines, total, updateQuantity, removeLine } = useCart();

  if (!cartOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-[60]" onClick={closeCart} />

      <div className="fixed top-0 right-0 h-full w-full max-w-[430px] bg-white z-[60] animate-slide-in flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-[rgba(0,0,0,0.1)]">
          <h2 className="font-display text-xl">Cart</h2>
          <button onClick={closeCart} className="p-2">
            <X size={20} />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <ShoppingBag size={48} className="text-muted mb-4" />
            <p className="font-display text-lg mb-2">Nothing here yet</p>
            <p className="text-sm text-[#666666] mb-6">
              Your selections will appear here.
            </p>
            <Link
              href="/store"
              onClick={closeCart}
              className="inline-flex items-center justify-center h-12 px-8 bg-black text-white text-sm font-semibold  hover:bg-black/90 transition-colors"
            >
              Browse the store
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {lines.map((line) => (
                <div
                  key={line.id}
                  className="flex gap-3 p-3 border border-[rgba(0,0,0,0.1)] "
                >
                  <div
                    className="w-16 h-20  flex-shrink-0"
                    style={{
                      background: `linear-gradient(150deg, ${line.toneFrom}, ${line.toneTo})`,
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {line.itemName}
                    </p>
                    <p className="text-xs text-muted">
                      {line.setName} · {line.size}
                    </p>
                    <p className="text-sm mt-1">{formatPrice(line.price)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          line.quantity > 1
                            ? updateQuantity(line.id, line.quantity - 1)
                            : removeLine(line.id)
                        }
                        className="w-7 h-7 border border-[rgba(0,0,0,0.16)]  flex items-center justify-center"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm w-6 text-center">
                        {line.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(line.id, line.quantity + 1)
                        }
                        className="w-7 h-7 border border-[rgba(0,0,0,0.16)]  flex items-center justify-center"
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        onClick={() => removeLine(line.id)}
                        className="ml-auto text-xs text-muted underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[rgba(0,0,0,0.1)] p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total</span>
                <span className="font-display text-xl">
                  {formatPrice(total)}
                </span>
              </div>
              <PincodeEstimator />
              <p className="text-xs text-[#666666]">
                All prices are final and inclusive of GST. No shipping charges.
              </p>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="block w-full h-12 bg-black text-white text-sm font-semibold  hover:bg-black/90 transition-colors flex items-center justify-center"
              >
                Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
