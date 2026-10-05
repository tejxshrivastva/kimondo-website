import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOrderConfirmation } from "@/lib/resend";

export async function POST(req: Request) {
  try {
    const body = await req.json();
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
