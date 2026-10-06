import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      orderLines: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    orders: orders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      status: o.status,
      totalMinor: o.totalMinor,
      createdAt: o.createdAt.toISOString(),
      deliveredAt: o.deliveredAt?.toISOString() || null,
      trackingRef: o.trackingUrl,
      lines: o.orderLines.map((l) => ({
        id: l.id,
        setName: l.setName,
        itemName: l.itemName,
        size: l.size,
        quantity: l.quantity,
        unitPriceMinor: l.unitPriceMinor,
      })),
    })),
  });
}
