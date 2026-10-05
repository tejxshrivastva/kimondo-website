import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { verifyPayment, isRazorpayLive } from "@/lib/razorpay";
import { sendOrderConfirmation } from "@/lib/resend";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature } =
    await req.json();

  const order = await prisma.order.findFirst({
    where: { id: orderId, userId: session.user.id, status: "payment_pending" },
    include: { orderLines: true },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const verified = await verifyPayment(
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature || ""
  );

  if (!verified) {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "payment_failed" },
    });
    return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: orderId },
      data: {
        status: "confirmed",
        razorpayPaymentId,
      },
    });

    for (const line of order.orderLines) {
      await tx.variant.update({
        where: { id: line.variantId },
        data: { stock: { decrement: line.quantity } },
      });
    }

    await tx.cartLine.deleteMany({
      where: { userId: session.user.id },
    });

    const settings = await tx.siteSettings.findFirst();
    const returnDays = settings?.returnWindowDays ?? 14;
    const solidifiesAt = new Date();
    solidifiesAt.setDate(solidifiesAt.getDate() + returnDays);

    const setNames = [...new Set(order.orderLines.map((l) => l.setName))];
    for (const setName of setNames) {
      const matchedSet = await tx.set.findFirst({
        where: { name: setName },
        include: { badge: true },
      });
      if (matchedSet?.badge) {
        await tx.badgeAward.create({
          data: {
            userId: session.user.id,
            badgeId: matchedSet.badge.id,
            orderId: order.id,
            state: "pending",
            solidifiesAt,
          },
        });
      }
    }
  });

  if (!isRazorpayLive) {
    console.log(`[Stub] Order ${order.orderNumber} confirmed. Cart cleared. Stock decremented.`);
  }

  const totalFormatted = `₹${(order.totalMinor / 100).toLocaleString("en-IN")}`;
  sendOrderConfirmation(
    session.user.email || order.contactEmail,
    order.orderNumber,
    totalFormatted,
    order.orderLines.length
  ).catch((err) => console.error("[Resend] Order confirmation failed:", err));

  return NextResponse.json({
    ok: true,
    orderNumber: order.orderNumber,
    orderId: order.id,
  });
}
