import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { syncOrderShipping } from "@/lib/sync-shipping";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { orderLines: true },
    orderBy: { createdAt: "desc" },
  });

  const synced = await Promise.all(
    orders.map(async (o) => {
      if ((o.status === "confirmed" || o.status === "shipped") && o.shiprocketAWB) {
        const updated = await syncOrderShipping(o.id);
        return updated ? { ...o, status: updated.status, deliveredAt: updated.deliveredAt } : o;
      }
      return o;
    })
  );

  return NextResponse.json({
    orders: synced.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      status: o.status,
      totalMinor: o.totalMinor,
      createdAt: o.createdAt.toISOString(),
      deliveredAt: o.deliveredAt?.toISOString() || null,
      trackingRef: o.trackingUrl,
      lines: orders.find((orig) => orig.id === o.id)?.orderLines.map((l) => ({
        id: l.id,
        setName: l.setName,
        itemName: l.itemName,
        size: l.size,
        quantity: l.quantity,
        unitPriceMinor: l.unitPriceMinor,
      })) || [],
    })),
  });
}
