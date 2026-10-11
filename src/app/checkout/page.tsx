"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Plus, MapPin, ChevronRight } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useOverlayStore } from "@/store/overlay-store";
import { formatPrice } from "@/lib/utils";

interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { lines, total, count } = useCart();
  const { openAuth } = useOverlayStore();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [formData, setFormData] = useState({
    label: "Home",
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      openAuth(() => {});
    }
  }, [status, openAuth]);

  useEffect(() => {
    if (session?.user) {
      fetch("/api/user/addresses")
        .then((r) => r.json())
        .then((data) => {
          setAddresses(data.addresses || []);
          const def = (data.addresses || []).find((a: Address) => a.isDefault);
          if (def) setSelectedAddressId(def.id);
        });
    }
  }, [session]);

  const handleSaveAddress = async () => {
    if (!formData.fullName || !formData.phone || !formData.line1 || !formData.city || !formData.state || !formData.pincode) return;
    setSaving(true);
    const res = await fetch("/api/user/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, isDefault: addresses.length === 0 }),
    });
    const data = await res.json();
    setSaving(false);
    if (data.address) {
      setAddresses((prev) => [...prev, data.address]);
      setSelectedAddressId(data.address.id);
      setShowAddressForm(false);
      setFormData({ label: "Home", fullName: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "" });
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  if (count === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl mb-3">Your cart is empty</h1>
        <p className="text-sm text-[#666666] mb-6">Add pieces from the collection before checking out.</p>
        <button onClick={() => router.push("/store")} className="h-12 px-8 bg-black text-white text-sm font-semibold ">
          Browse the store
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[720px] mx-auto px-4 py-8">
      <h1 className="text-3xl mb-8">Checkout</h1>

      <section className="mb-8">
        <h2 className="text-sm font-semibold tracking-[0.1em] uppercase mb-4">Delivery address</h2>

        {addresses.length > 0 && !showAddressForm && (
          <div className="space-y-3">
            {addresses.map((addr) => (
              <label
                key={addr.id}
                className={`flex items-start gap-3 p-4 border  cursor-pointer transition-colors ${
                  selectedAddressId === addr.id
                    ? "border-black bg-[#f8f8f8]"
                    : "border-[rgba(0,0,0,0.12)] hover:border-[rgba(0,0,0,0.24)]"
                }`}
              >
                <input
                  type="radio"
                  name="address"
                  checked={selectedAddressId === addr.id}
                  onChange={() => setSelectedAddressId(addr.id)}
                  className="mt-1 accent-black"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{addr.fullName}</p>
                  <p className="text-xs text-muted mt-0.5">
                    {addr.line1}
                    {addr.line2 ? `, ${addr.line2}` : ""}
                  </p>
                  <p className="text-xs text-muted">
                    {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                  <p className="text-xs text-muted">{addr.phone}</p>
                </div>
                <span className="text-[10px] font-medium tracking-wider uppercase text-muted border border-[rgba(0,0,0,0.12)] px-2 py-0.5 ">
                  {addr.label}
                </span>
              </label>
            ))}
            <button
              onClick={() => setShowAddressForm(true)}
              className="flex items-center gap-2 text-sm font-medium mt-2 hover:underline"
            >
              <Plus size={16} /> Add new address
            </button>
          </div>
        )}

        {(addresses.length === 0 || showAddressForm) && (
          <div className="border border-[rgba(0,0,0,0.12)]  p-4 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={16} className="text-muted" />
              <span className="text-sm font-medium">
                {addresses.length === 0 ? "Add your delivery address" : "New address"}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                placeholder="Full name"
                value={formData.fullName}
                onChange={(e) => setFormData((p) => ({ ...p, fullName: e.target.value }))}
                className="col-span-2 border border-[rgba(0,0,0,0.16)]  p-3 text-sm focus:outline-none focus:border-black"
              />
              <input
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                className="col-span-2 border border-[rgba(0,0,0,0.16)]  p-3 text-sm focus:outline-none focus:border-black"
              />
              <input
                placeholder="Address line 1"
                value={formData.line1}
                onChange={(e) => setFormData((p) => ({ ...p, line1: e.target.value }))}
                className="col-span-2 border border-[rgba(0,0,0,0.16)]  p-3 text-sm focus:outline-none focus:border-black"
              />
              <input
                placeholder="Line 2 (optional)"
                value={formData.line2}
                onChange={(e) => setFormData((p) => ({ ...p, line2: e.target.value }))}
                className="col-span-2 border border-[rgba(0,0,0,0.16)]  p-3 text-sm focus:outline-none focus:border-black"
              />
              <input
                placeholder="City"
                value={formData.city}
                onChange={(e) => setFormData((p) => ({ ...p, city: e.target.value }))}
                className="border border-[rgba(0,0,0,0.16)]  p-3 text-sm focus:outline-none focus:border-black"
              />
              <input
                placeholder="State"
                value={formData.state}
                onChange={(e) => setFormData((p) => ({ ...p, state: e.target.value }))}
                className="border border-[rgba(0,0,0,0.16)]  p-3 text-sm focus:outline-none focus:border-black"
              />
              <input
                placeholder="Pincode"
                value={formData.pincode}
                onChange={(e) => setFormData((p) => ({ ...p, pincode: e.target.value }))}
                className="border border-[rgba(0,0,0,0.16)]  p-3 text-sm focus:outline-none focus:border-black"
              />
              <select
                value={formData.label}
                onChange={(e) => setFormData((p) => ({ ...p, label: e.target.value }))}
                className="border border-[rgba(0,0,0,0.16)]  p-3 text-sm focus:outline-none focus:border-black bg-white"
              >
                <option value="Home">Home</option>
                <option value="Work">Work</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              {showAddressForm && (
                <button
                  onClick={() => setShowAddressForm(false)}
                  className="h-10 px-6 text-sm font-medium border border-[rgba(0,0,0,0.16)] "
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleSaveAddress}
                disabled={saving}
                className="h-10 px-6 bg-black text-white text-sm font-semibold  disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save address"}
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="mb-8">
        <h2 className="text-sm font-semibold tracking-[0.1em] uppercase mb-4">Order summary</h2>
        <div className="border border-[rgba(0,0,0,0.12)]  divide-y divide-[rgba(0,0,0,0.08)]">
          {lines.map((line) => (
            <div key={line.id} className="flex items-center gap-3 p-4">
              <div
                className="w-12 h-14  flex-shrink-0"
                style={{
                  background: `linear-gradient(150deg, ${line.toneFrom}, ${line.toneTo})`,
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{line.itemName}</p>
                <p className="text-xs text-muted">{line.setName} · {line.size} · Qty {line.quantity}</p>
              </div>
              <p className="text-sm">{formatPrice(line.price * line.quantity)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-[rgba(0,0,0,0.12)] pt-6">
        <div className="flex justify-between items-center">
          <span className="font-medium">Total ({count} {count === 1 ? "item" : "items"})</span>
          <span className="text-xl">{formatPrice(total)}</span>
        </div>

        <button
          onClick={() => {
            if (selectedAddressId) {
              router.push(`/checkout/summary?address=${selectedAddressId}`);
            }
          }}
          disabled={!selectedAddressId}
          className="w-full h-12 bg-black text-white text-sm font-semibold  mt-6 flex items-center justify-center gap-2 hover:bg-black/90 transition-colors disabled:opacity-50"
        >
          Continue to payment <ChevronRight size={16} />
        </button>
        <p className="text-xs text-[#666666] text-center mt-3">All prices include GST. Free delivery across India.</p>
      </section>
    </div>
  );
}
