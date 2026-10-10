"use client";

import useSWR from "swr";
import { toast } from "sonner";
import { useOverlayStore } from "@/store/overlay-store";

interface CartLine {
  id: string;
  variantId: string;
  setSlug: string;
  setName: string;
  itemName: string;
  category: string;
  size: string;
  price: number;
  quantity: number;
  stock: number;
  toneFrom: string;
  toneTo: string;
}

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useCart() {
  const { data, mutate, isLoading } = useSWR<{ lines: CartLine[] }>(
    "/api/cart",
    fetcher
  );
  const { openAuth } = useOverlayStore();

  const lines = data?.lines ?? [];
  const count = lines.reduce((sum, l) => sum + l.quantity, 0);
  const total = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);

  async function addItem(variantId: string, setId: string, itemName: string) {
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId, setId }),
      });
      if (!res.ok) {
        if (res.status === 401) {
          openAuth(() => addItem(variantId, setId, itemName));
          return false;
        }
        const data = await res.json();
        toast.error(data.error || "Could not add to cart");
        return false;
      }
      await mutate();
      toast(`${itemName} added to cart`);
      return true;
    } catch {
      toast.error("Could not add to cart");
      return false;
    }
  }

  async function updateQuantity(lineId: string, quantity: number) {
    await fetch("/api/cart", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lineId, quantity }),
    });
    await mutate();
  }

  async function removeLine(lineId: string) {
    await fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lineId }),
    });
    await mutate();
    toast("Item removed from cart");
  }

  return {
    lines,
    count,
    total,
    isLoading,
    addItem,
    updateQuantity,
    removeLine,
    mutate,
  };
}
