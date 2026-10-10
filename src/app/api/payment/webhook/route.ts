import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmation } from "@/lib/resend";
import { createHmac } from "crypto";

const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || "";

function verifyWebhookSignature(body: string, signature: string): boolean {
  if (!WEBHOOK_SECRET) return true;
  const expected = createHmac("sha256", WEBHOOK_SECRET).update(body).digest("hex");
  return expected === signature;
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature") || "";

    if (WEBHOOK_SECRET && !verifyWebhookSignature(rawBody, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const body = JSON.parse(rawBody);
    const event = body.event;
    const payload = body.payload;

    if (event === "payment.captured") {
      const razorpayOrderId = payload?.payment?.entity?.order_id;
      const razorpayPaymentId = payload?.payment?.entity?.id;

      if (!razorpayOrderId) {
        return NextResponse.json({ ok: true });
      }

      const order = await prisma.order.findFirst({
        where: { razorpayOrderId, status: "payment_pending" },
        include: { orderLines: true },
      });

      if (!order) {
        return NextResponse.json({ ok: true });
      }

      await prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { id: order.id },
          data: { status: "confirmed", razorpayPaymentId },
        });

        for (const line of order.orderLines) {
          await tx.variant.update({
            where: { id: line.variantId },
            data: { stock: { decrement: line.quantity } },
          });
        }

        await tx.cartLine.deleteMany({ where: { userId: order.userId } });
      });

      const totalFormatted = `₹${(order.totalMinor / 100).toLocaleString("en-IN")}`;
      sendOrderConfirmation(
        order.contactEmail,
        order.orderNumber,
        totalFormatted,
        order.orderLines.length
      ).catch((err) => console.error("[Resend] Webhook order confirmation failed:", err));
    }

    if (event === "payment.failed") {
      const razorpayOrderId = payload?.payment?.entity?.order_id;
      if (razorpayOrderId) {
        await prisma.order.updateMany({
          where: { razorpayOrderId, status: "payment_pending" },
          data: { status: "payment_failed" },
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
