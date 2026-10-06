"use client";

import { SessionProvider } from "next-auth/react";
import { AuthDrawer } from "@/components/auth/auth-drawer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { SizePicker } from "@/components/product/size-picker";
import { NotifyModal } from "@/components/product/notify-modal";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { SizeGuideModal } from "@/components/product/size-guide-modal";
import { ReturnForm } from "@/components/profile/return-form";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <AuthDrawer />
      <CartDrawer />
      <SizePicker />
      <NotifyModal />
      <SizeGuideModal />
      <MobileMenu />
      <ReturnForm />
    </SessionProvider>
  );
}
