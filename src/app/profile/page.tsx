"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Package,
  Award,
  Ruler,
  LogOut,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useOverlayStore } from "@/store/overlay-store";

interface OrderLine {
  id: string;
  setName: string;
  itemName: string;
  size: string;
  quantity: number;
  unitPriceMinor: number;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalMinor: number;
  createdAt: string;
  deliveredAt: string | null;
  trackingRef: string | null;
  lines: OrderLine[];
}

interface BadgeAward {
  id: string;
  state: string;
  badge: { name: string; artwork: string };
}

interface SavedSize {
  id: string;
  label: string;
  isSelf: boolean;
  topSize: string;
  bottomSize: string;
}

const STATUS_LABELS: Record<string, string> = {
  payment_pending: "Payment pending",
  payment_failed: "Payment failed",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  in_transit: "In transit",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  return_requested: "Return requested",
  return_approved: "Return approved",
  return_picked: "Return picked up",
  return_completed: "Return completed",
  exchange_requested: "Exchange requested",
  exchange_approved: "Exchange approved",
  exchange_shipped: "Exchange shipped",
  exchange_delivered: "Exchange delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { openAuth } = useOverlayStore();
  const [tab, setTab] = useState<"orders" | "badges" | "sizes">("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [badges, setBadges] = useState<BadgeAward[]>([]);
  const [sizes, setSizes] = useState<SavedSize[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [showSizeForm, setShowSizeForm] = useState(false);
  const [sizeForm, setSizeForm] = useState({
    label: "Me",
    isSelf: true,
    topSize: "",
    bottomSize: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      openAuth(() => {});
    }
  }, [status, openAuth]);

  useEffect(() => {
    if (!session?.user) return;
    fetch("/api/user/orders").then((r) => r.json()).then((d) => setOrders(d.orders || []));
    fetch("/api/user/badges").then((r) => r.json()).then((d) => setBadges(d.awards || []));
    fetch("/api/user/sizes").then((r) => r.json()).then((d) => setSizes(d.sizes || []));
  }, [session]);

  if (status === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  if (!session?.user) return null;

  const memberSince = new Date(session.user.memberSince || Date.now());

  const handleSaveSize = async () => {
    if (!sizeForm.topSize || !sizeForm.bottomSize) return;
    const res = await fetch("/api/user/sizes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sizeForm),
    });
    const data = await res.json();
    if (data.size) {
      setSizes((prev) => [data.size, ...prev]);
      setShowSizeForm(false);
      setSizeForm({ label: "Me", isSelf: true, topSize: "", bottomSize: "" });
    }
  };

  const handleDeleteSize = async (id: string) => {
    await fetch("/api/user/sizes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setSizes((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="max-w-[720px] mx-auto px-4 py-8">
      {/* Membership card */}
      <div className="bg-black text-white rounded-[16px] p-6 mb-8">
        <p className="text-[9px] font-semibold tracking-[0.3em] uppercase text-white/60 mb-1">
          KIMONDO MEMBER
        </p>
        <h1 className="font-display text-2xl mb-1">
          {session.user.name || session.user.email}
        </h1>
        <p className="text-xs text-white/60">{session.user.email}</p>
        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/10">
          <div>
            <p className="text-xs text-white/60">Member since</p>
            <p className="text-sm font-medium">
              {memberSince.toLocaleDateString("en-IN", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div>
            <p className="text-xs text-white/60">Orders</p>
            <p className="text-sm font-medium">{orders.length}</p>
          </div>
          <div>
            <p className="text-xs text-white/60">Badges</p>
            <p className="text-sm font-medium">{badges.length}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-[rgba(0,0,0,0.08)]">
        {[
          { key: "orders" as const, label: "Orders", icon: Package },
          { key: "badges" as const, label: "Badges", icon: Award },
          { key: "sizes" as const, label: "Saved sizes", icon: Ruler },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === key
                ? "border-black text-black"
                : "border-transparent text-muted hover:text-black"
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* Orders */}
      {tab === "orders" && (
        <div className="space-y-3">
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <Package size={40} className="mx-auto text-muted mb-3" />
              <p className="font-display text-lg mb-1">No orders yet</p>
              <p className="text-sm text-muted mb-4">Lorem ipsum dolor sit amet.</p>
              <button onClick={() => router.push("/store")} className="text-sm font-medium underline">
                Browse the store
              </button>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="border border-[rgba(0,0,0,0.12)] rounded-[12px]">
                <button
                  onClick={() =>
                    setExpandedOrder(expandedOrder === order.id ? null : order.id)
                  }
                  className="w-full flex items-center justify-between p-4"
                >
                  <div className="text-left">
                    <p className="text-sm font-mono font-medium">{order.orderNumber}</p>
                    <p className="text-xs text-muted mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium px-2 py-1 bg-surface rounded-full capitalize">
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                    <span className="text-sm font-medium">{formatPrice(order.totalMinor)}</span>
                    {expandedOrder === order.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>
                {expandedOrder === order.id && (
                  <div className="border-t border-[rgba(0,0,0,0.08)] p-4 space-y-2">
                    {order.lines.map((line) => (
                      <div key={line.id} className="flex justify-between text-sm">
                        <span>
                          {line.itemName}{" "}
                          <span className="text-muted">({line.size} × {line.quantity})</span>
                        </span>
                        <span>{formatPrice(line.unitPriceMinor * line.quantity)}</span>
                      </div>
                    ))}
                    {order.trackingRef && (
                      <p className="text-xs text-muted pt-2 border-t border-[rgba(0,0,0,0.08)]">
                        Tracking: {order.trackingRef}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Badges */}
      {tab === "badges" && (
        <div>
          {badges.length === 0 ? (
            <div className="text-center py-12">
              <Award size={40} className="mx-auto text-muted mb-3" />
              <p className="font-display text-lg mb-1">No badges yet</p>
              <p className="text-sm text-muted">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {badges.map((award) => (
                <div
                  key={award.id}
                  className={`border rounded-[12px] p-4 text-center ${
                    award.state === "solidified"
                      ? "border-black"
                      : "border-[rgba(0,0,0,0.12)] opacity-60"
                  }`}
                >
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-surface flex items-center justify-center text-2xl">
                    {award.badge.artwork || "🏷"}
                  </div>
                  <p className="text-sm font-medium">{award.badge.name}</p>
                  <p className="text-[10px] text-muted uppercase tracking-wider mt-1">
                    {award.state}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Saved Sizes */}
      {tab === "sizes" && (
        <div className="space-y-3">
          {sizes.map((size) => (
            <div
              key={size.id}
              className="flex items-center justify-between p-4 border border-[rgba(0,0,0,0.12)] rounded-[12px]"
            >
              <div>
                <p className="text-sm font-medium">{size.label}</p>
                <p className="text-xs text-muted mt-0.5">
                  Top: {size.topSize} · Bottom: {size.bottomSize}
                </p>
              </div>
              <button
                onClick={() => handleDeleteSize(size.id)}
                className="p-2 text-muted hover:text-red-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          {showSizeForm ? (
            <div className="border border-[rgba(0,0,0,0.12)] rounded-[12px] p-4 space-y-3">
              <input
                placeholder="Label (e.g. Me, Partner)"
                value={sizeForm.label}
                onChange={(e) => setSizeForm((p) => ({ ...p, label: e.target.value }))}
                className="w-full border border-[rgba(0,0,0,0.16)] rounded-[12px] p-3 text-sm focus:outline-none focus:border-black"
              />
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={sizeForm.topSize}
                  onChange={(e) => setSizeForm((p) => ({ ...p, topSize: e.target.value }))}
                  className="border border-[rgba(0,0,0,0.16)] rounded-[12px] p-3 text-sm bg-white focus:outline-none focus:border-black"
                >
                  <option value="">Top size</option>
                  {["XS", "S", "M", "L", "XL", "XXL"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <select
                  value={sizeForm.bottomSize}
                  onChange={(e) => setSizeForm((p) => ({ ...p, bottomSize: e.target.value }))}
                  className="border border-[rgba(0,0,0,0.16)] rounded-[12px] p-3 text-sm bg-white focus:outline-none focus:border-black"
                >
                  <option value="">Bottom size</option>
                  {["XS", "S", "M", "L", "XL", "XXL"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowSizeForm(false)}
                  className="h-10 px-6 text-sm font-medium border border-[rgba(0,0,0,0.16)] rounded-[12px]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSize}
                  className="h-10 px-6 bg-black text-white text-sm font-semibold rounded-[12px]"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowSizeForm(true)}
              className="flex items-center gap-2 text-sm font-medium hover:underline"
            >
              <Plus size={16} /> Add size profile
            </button>
          )}
        </div>
      )}

      {/* Sign out */}
      <div className="mt-12 pt-6 border-t border-[rgba(0,0,0,0.08)]">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-2 text-sm text-muted hover:text-black"
        >
          <LogOut size={16} /> Sign out
        </button>
      </div>
    </div>
  );
}
