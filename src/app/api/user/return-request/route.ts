import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId, type, reason } = await req.json();

  if (!orderId || !type || !["return", "exchange"].includes(type)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Verify the order belongs to this user
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId: session.user.id },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  await prisma.returnRequest.create({
    data: {
      orderId,
      type,
      lineIds: "",
      reason: reason || "",
      status: "pending",
    },
  });

  return NextResponse.json({ ok: true });
}
