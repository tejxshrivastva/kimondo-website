"use client";

import { SessionProvider } from "next-auth/react";
import { AuthDrawer } from "@/components/auth/auth-drawer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { SizePicker } from "@/components/product/size-picker";
import { NotifyModal } from "@/components/product/notify-modal";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <AuthDrawer />
      <CartDrawer />
      <SizePicker />
      <NotifyModal />
    </SessionProvider>
  );
}
