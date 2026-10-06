"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Check, X as XIcon, Loader2 } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";

type PaymentState = "idle" | "processing" | "success" | "failed";

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
}

function SummaryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const addressId = searchParams.get("address");
  const { status } = useSession();
  const { lines, total, count, mutate } = useCart();
  const [address, setAddress] = useState<Address | null>(null);
  const [paymentState, setPaymentState] = useState<PaymentState>("idle");
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    if (!addressId) {
      router.replace("/checkout");
      return;
    }
    fetch("/api/user/addresses")
      .then((r) => r.json())
      .then((data) => {
        const found = (data.addresses || []).find((a: Address) => a.id === addressId);
        if (found) setAddress(found);
        else router.replace("/checkout");
      });
  }, [addressId, router]);

  const handlePay = async () => {
    if (!addressId) return;
    setPaymentState("processing");

    try {
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addressId }),
      });
      const orderData = await res.json();

      if (!res.ok) {
        setPaymentState("failed");
        return;
      }

      if (orderData.razorpayKeyId === "rzp_test_stub") {
        const verifyRes = await fetch("/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: orderData.orderId,
            razorpayPaymentId: `pay_STUB_${Date.now()}`,
            razorpayOrderId: orderData.razorpayOrderId,
            razorpaySignature: "stub_signature",
          }),
        });
        const verifyData = await verifyRes.json();
        if (verifyData.ok) {
          setOrderNumber(verifyData.orderNumber);
          setPaymentState("success");
          mutate();
        } else {
          setPaymentState("failed");
        }
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        const options = {
          key: orderData.razorpayKeyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "Kimondo",
          description: `Order ${orderData.orderNumber}`,
          order_id: orderData.razorpayOrderId,
          prefill: orderData.prefill,
          handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: orderData.orderId,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.ok) {
              setOrderNumber(verifyData.orderNumber);
              setPaymentState("success");
              mutate();
            } else {
              setPaymentState("failed");
            }
          },
          modal: {
            ondismiss: () => setPaymentState("idle"),
          },
          theme: { color: "#000000" },
        };
        // @ts-expect-error Razorpay is loaded from external script
        const rzp = new window.Razorpay(options);
        rzp.open();
      };
      document.body.appendChild(script);
    } catch {
      setPaymentState("failed");
    }
  };

  if (status === "loading" || !address) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-muted">Loading...</p>
      </div>
    );
  }

  if (paymentState === "processing") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <Loader2 size={48} className="animate-spin mb-4" />
        <h2 className="font-display text-2xl mb-2">Processing your payment</h2>
        <p className="text-sm text-[#666666]">Processing your payment</p>
      </div>
    );
  }

  if (paymentState === "success") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center mb-6">
          <Check size={32} />
        </div>
        <h2 className="font-display text-3xl mb-2">Order placed</h2>
        <p className="text-[#666666] mb-1">Your order has been confirmed. You will receive updates by email.</p>
        <p className="text-sm font-mono font-medium mb-8">{orderNumber}</p>
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/profile")}
            className="h-12 px-8 bg-black text-white text-sm font-semibold "
          >
            View orders
          </button>
          <button
            onClick={() => router.push("/store")}
            className="h-12 px-8 border border-[rgba(0,0,0,0.16)] text-sm font-medium "
          >
            Continue shopping
          </button>
        </div>
      </div>
    );
  }

  if (paymentState === "failed") {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center mb-6">
          <XIcon size={32} />
        </div>
        <h2 className="font-display text-3xl mb-2">Payment failed</h2>
        <p className="text-sm text-[#666666] mb-6">Payment could not be completed. No amount has been charged.</p>
        <button
          onClick={() => setPaymentState("idle")}
          className="h-12 px-8 bg-black text-white text-sm font-semibold "
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[720px] mx-auto px-4 py-8">
      <h1 className="font-display text-3xl mb-8">Confirm & pay</h1>

      <section className="mb-6">
        <h2 className="text-sm font-semibold tracking-[0.1em] uppercase mb-3">Delivering to</h2>
        <div className="p-4 border border-[rgba(0,0,0,0.12)] ">
          <p className="text-sm font-medium">{address.fullName}</p>
          <p className="text-xs text-muted mt-1">
            {address.line1}{address.line2 ? `, ${address.line2}` : ""}
          </p>
          <p className="text-xs text-muted">{address.city}, {address.state} - {address.pincode}</p>
          <p className="text-xs text-muted">{address.phone}</p>
          <button
            onClick={() => router.push("/checkout")}
            className="text-xs font-medium underline mt-2"
          >
            Change
          </button>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-sm font-semibold tracking-[0.1em] uppercase mb-3">
          {count} {count === 1 ? "item" : "items"}
        </h2>
        <div className="border border-[rgba(0,0,0,0.12)]  divide-y divide-[rgba(0,0,0,0.08)]">
          {lines.map((line) => (
            <div key={line.id} className="flex items-center gap-3 p-4">
              <div
                className="w-10 h-12  flex-shrink-0"
                style={{
                  background: `linear-gradient(150deg, ${line.toneFrom}, ${line.toneTo})`,
                }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{line.itemName}</p>
                <p className="text-xs text-muted">{line.size} · Qty {line.quantity}</p>
              </div>
              <p className="text-sm">{formatPrice(line.price * line.quantity)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-[rgba(0,0,0,0.12)] pt-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="font-medium">Total ({count} {count === 1 ? "item" : "items"})</span>
          <span className="font-display text-xl">{formatPrice(total)}</span>
        </div>
      </section>

      <button
        onClick={handlePay}
        className="w-full h-14 bg-black text-white text-sm font-semibold  hover:bg-black/90 transition-colors"
      >
        Pay {formatPrice(total)}
      </button>
      <p className="text-xs text-muted text-center mt-3">
        All prices include GST. Free delivery across India.
      </p>
    </div>
  );
}

export default function SummaryPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center"><p className="text-muted">Loading...</p></div>}>
      <SummaryContent />
    </Suspense>
  );
}
