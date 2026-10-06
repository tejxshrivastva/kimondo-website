const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "";

export const isRazorpayLive = !!(RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET);

let stubOrderCounter = 1000;

export async function createRazorpayOrder(amountPaise: number, receipt: string) {
  if (!isRazorpayLive) {
    const orderId = `order_STUB_${++stubOrderCounter}`;
    console.log(`[Razorpay Stub] Created order ${orderId} for ₹${(amountPaise / 100).toFixed(2)}`);
    return {
      id: orderId,
      amount: amountPaise,
      currency: "INR",
      receipt,
      status: "created",
    };
  }

  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64")}`,
    },
    body: JSON.stringify({
      amount: amountPaise,
      currency: "INR",
      receipt,
    }),
  });

  const data = await res.json();
  if (!res.ok || data.error) {
    console.error("[Razorpay] Order creation failed:", JSON.stringify(data));
    throw new Error(data.error?.description || "Razorpay order creation failed");
  }
  return data;
}

export async function verifyPayment(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
) {
  if (!isRazorpayLive) {
    console.log(`[Razorpay Stub] Verified payment ${razorpayPaymentId} for order ${razorpayOrderId}`);
    return true;
  }

  const crypto = await import("crypto");
  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expected = crypto
    .createHmac("sha256", RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  return expected === razorpaySignature;
}

export function getRazorpayKeyId() {
  return isRazorpayLive ? RAZORPAY_KEY_ID : "rzp_test_stub";
}
