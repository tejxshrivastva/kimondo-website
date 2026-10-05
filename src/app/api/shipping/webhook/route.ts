import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendShippedEmail } from "@/lib/resend";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const awb = body.awb;
    const status = body.current_status;

    if (!awb) {
      return NextResponse.json({ error: "Missing AWB" }, { status: 400 });
    }

    const order = await prisma.order.findFirst({
      where: { shiprocketAWB: awb },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (status === "DELIVERED" || status === "7") {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "delivered", deliveredAt: new Date() },
      });
    } else if (status === "SHIPPED" || status === "NEW" || status === "6") {
      if (order.status === "confirmed") {
        await prisma.order.update({
          where: { id: order.id },
          data: { status: "shipped" },
        });
        sendShippedEmail(order.contactEmail, order.orderNumber, order.trackingUrl).catch(
          (err) => console.error("[Resend] Shipped email failed:", err)
        );
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
