import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createShipment } from "@/lib/shiprocket";
import { sendShippedEmail } from "@/lib/resend";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || !["admin", "editor"].includes(session.user.role || "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const { status, trackingRef } = await req.json();

  const order = await prisma.order.findUnique({
    where: { id },
    include: { orderLines: { include: { variant: true } } },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const updateData: Record<string, unknown> = { status };

  if (status === "delivered") {
    updateData.deliveredAt = new Date();
  }

  if (status === "shipped") {
    if (trackingRef) {
      updateData.trackingRef = trackingRef;
    }

    const address = JSON.parse(order.addressSnapshot || "{}");
    try {
      const shipment = await createShipment({
        orderId: order.id,
        orderNumber: order.orderNumber,
        contactName: order.contactName,
        contactPhone: order.contactPhone,
        contactEmail: order.contactEmail,
        address: address.line1 + (address.line2 ? `, ${address.line2}` : ""),
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        items: order.orderLines.map((l) => ({
          name: l.itemName,
          sku: l.variant.sku || `${l.itemName}-${l.size}`,
          units: l.quantity,
          sellingPrice: l.unitPriceMinor / 100,
        })),
        totalAmount: order.totalMinor / 100,
      });

      if (shipment.shiprocketOrderId) {
        updateData.shiprocketOrderId = shipment.shiprocketOrderId;
      }
      if (shipment.awb) {
        updateData.shiprocketAWB = shipment.awb;
        updateData.trackingRef = shipment.awb;
        updateData.trackingUrl = shipment.trackingUrl;
      }
    } catch (err) {
      console.error("[Admin] Shiprocket shipment creation failed:", err);
    }

    sendShippedEmail(
      order.contactEmail,
      order.orderNumber,
      (updateData.trackingUrl as string) || null
    ).catch((err) => console.error("[Resend] Shipped email failed:", err));
  }

  await prisma.order.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json({ ok: true });
}
