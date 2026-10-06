import { prisma } from "@/lib/prisma";
import { getShipmentStatus } from "@/lib/shiprocket";
import { sendShippedEmail } from "@/lib/resend";

export async function syncOrderShipping(orderId: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order || !order.shiprocketAWB) return order;
  if (order.status === "delivered" || order.status === "cancelled") return order;

  const lastSync = order.updatedAt.getTime();
  if (Date.now() - lastSync < 5 * 60 * 1000) return order;

  const tracking = await getShipmentStatus(order.shiprocketAWB);
  if (!tracking.status) return order;

  if (tracking.delivered && order.status !== "delivered") {
    return prisma.order.update({
      where: { id: orderId },
      data: { status: "delivered", deliveredAt: new Date() },
    });
  }

  if (tracking.shipped && order.status === "confirmed") {
    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { status: "shipped" },
    });
    sendShippedEmail(order.contactEmail, order.orderNumber, order.trackingUrl).catch(
      (err) => console.error("[Resend] Shipped email failed:", err)
    );
    return updated;
  }

  return order;
}

export async function syncAllPendingOrders() {
  const pending = await prisma.order.findMany({
    where: {
      status: { in: ["confirmed", "shipped"] },
      shiprocketAWB: { not: null },
    },
  });

  for (const order of pending) {
    await syncOrderShipping(order.id);
  }
}
