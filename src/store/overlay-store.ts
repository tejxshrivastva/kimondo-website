"use client";

import { create } from "zustand";

interface OverlayState {
  authOpen: boolean;
  cartOpen: boolean;
  menuOpen: boolean;
  pickerOpen: boolean;
  pickerSetSlug: string | null;
  pickerItemId: string | null;
  pickerMode: "item" | "set";
  sizeGuideOpen: boolean;
  notifyOpen: boolean;
  notifyVariantId: string | null;
  addressFormOpen: boolean;
  addressEditId: string | null;
  returnFormOpen: boolean;
  returnOrderId: string | null;
  returnType: "return" | "exchange";
  pendingAction: (() => void) | null;

  openAuth: (pending?: () => void) => void;
  closeAuth: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleMenu: () => void;
  closeMenu: () => void;
  openItemPicker: (setSlug: string, itemId: string) => void;
  openSetPicker: (setSlug: string) => void;
  closePicker: () => void;
  openSizeGuide: () => void;
  closeSizeGuide: () => void;
  openNotify: (variantId: string) => void;
  closeNotify: () => void;
  openAddressForm: (editId?: string) => void;
  closeAddressForm: () => void;
  openReturnForm: (orderId: string, type: "return" | "exchange") => void;
  closeReturnForm: () => void;
  closeAll: () => void;
}

export const useOverlayStore = create<OverlayState>((set) => ({
  authOpen: false,
  cartOpen: false,
  menuOpen: false,
  pickerOpen: false,
  pickerSetSlug: null,
  pickerItemId: null,
  pickerMode: "item",
  sizeGuideOpen: false,
  notifyOpen: false,
  notifyVariantId: null,
  addressFormOpen: false,
  addressEditId: null,
  returnFormOpen: false,
  returnOrderId: null,
  returnType: "return",
  pendingAction: null,

  openAuth: (pending) =>
    set({ authOpen: true, pendingAction: pending ?? null }),
  closeAuth: () => set({ authOpen: false, pendingAction: null }),
  openCart: () => set({ cartOpen: true }),
  closeCart: () => set({ cartOpen: false }),
  toggleMenu: () => set((s) => ({ menuOpen: !s.menuOpen })),
  closeMenu: () => set({ menuOpen: false }),
  openItemPicker: (setSlug, itemId) =>
    set({
      pickerOpen: true,
      pickerSetSlug: setSlug,
      pickerItemId: itemId,
      pickerMode: "item",
    }),
  openSetPicker: (setSlug) =>
    set({
      pickerOpen: true,
      pickerSetSlug: setSlug,
      pickerItemId: null,
      pickerMode: "set",
    }),
  closePicker: () =>
    set({
      pickerOpen: false,
      pickerSetSlug: null,
      pickerItemId: null,
    }),
  openSizeGuide: () => set({ sizeGuideOpen: true }),
  closeSizeGuide: () => set({ sizeGuideOpen: false }),
  openNotify: (variantId) =>
    set({ notifyOpen: true, notifyVariantId: variantId }),
  closeNotify: () => set({ notifyOpen: false, notifyVariantId: null }),
  openAddressForm: (editId) =>
    set({ addressFormOpen: true, addressEditId: editId ?? null }),
  closeAddressForm: () =>
    set({ addressFormOpen: false, addressEditId: null }),
  openReturnForm: (orderId, type) =>
    set({ returnFormOpen: true, returnOrderId: orderId, returnType: type }),
  closeReturnForm: () =>
    set({ returnFormOpen: false, returnOrderId: null }),
  closeAll: () =>
    set({
      authOpen: false,
      cartOpen: false,
      menuOpen: false,
      pickerOpen: false,
      sizeGuideOpen: false,
      notifyOpen: false,
      addressFormOpen: false,
      returnFormOpen: false,
      pendingAction: null,
    }),
}));
