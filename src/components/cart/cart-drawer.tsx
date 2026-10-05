"use client";

import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useOverlayStore } from "@/store/overlay-store";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const { cartOpen, closeCart } = useOverlayStore();
  const { lines, total, updateQuantity, removeLine } = useCart();

  if (!cartOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-[60]" onClick={closeCart} />

      <div className="fixed top-0 right-0 h-full w-full max-w-[430px] bg-white z-[60] shadow-xl animate-slide-in flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-[rgba(0,0,0,0.1)]">
          <h2 className="font-display text-xl">Cart</h2>
          <button onClick={closeCart} className="p-2">
            <X size={20} />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <ShoppingBag size={48} className="text-muted mb-4" />
            <p className="font-display text-lg mb-2">Your cart is empty</p>
            <p className="text-sm text-muted mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            <Link
              href="/store"
              onClick={closeCart}
              className="inline-flex items-center justify-center h-12 px-8 bg-black text-white text-sm font-semibold rounded-[12px] hover:bg-black/90 transition-colors"
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
                  className="flex gap-3 p-3 border border-[rgba(0,0,0,0.1)] rounded-[12px]"
                >
                  <div
                    className="w-16 h-20 rounded-lg flex-shrink-0"
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
                        className="w-7 h-7 border border-[rgba(0,0,0,0.16)] rounded-lg flex items-center justify-center"
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
                        className="w-7 h-7 border border-[rgba(0,0,0,0.16)] rounded-lg flex items-center justify-center"
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
              <p className="text-xs text-muted">
                Lorem ipsum dolor sit amet. Consectetur adipiscing.
              </p>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="block w-full h-12 bg-black text-white text-sm font-semibold rounded-[12px] hover:bg-black/90 transition-colors flex items-center justify-center"
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
