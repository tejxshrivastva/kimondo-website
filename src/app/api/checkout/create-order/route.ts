import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createRazorpayOrder, getRazorpayKeyId } from "@/lib/razorpay";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { addressId } = await req.json();
  if (!addressId) {
    return NextResponse.json({ error: "addressId required" }, { status: 400 });
  }

  const address = await prisma.address.findFirst({
    where: { id: addressId, userId: session.user.id },
  });
  if (!address) {
    return NextResponse.json({ error: "Address not found" }, { status: 404 });
  }

  const cartLines = await prisma.cartLine.findMany({
    where: { userId: session.user.id },
    include: {
      variant: {
        include: {
          item: {
            include: { set: { select: { name: true } } },
          },
        },
      },
    },
  });

  if (cartLines.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  for (const line of cartLines) {
    if (line.variant.stock < line.quantity) {
      return NextResponse.json(
        { error: `${line.variant.item.name} (${line.variant.size}) is out of stock` },
        { status: 400 }
      );
    }
  }

  const totalMinor = cartLines.reduce(
    (sum, l) => sum + l.variant.item.price * l.quantity,
    0
  );

  const orderCount = await prisma.order.count();
  const orderNumber = `KMD-${String(orderCount + 1).padStart(5, "0")}`;

  const razorpayOrder = await createRazorpayOrder(totalMinor, orderNumber);

  const order = await prisma.order.create({
    data: {
      orderNumber,
      userId: session.user.id,
      contactName: address.fullName,
      contactPhone: address.phone,
      contactEmail: session.user.email || "",
      addressSnapshot: JSON.stringify({
        fullName: address.fullName,
        phone: address.phone,
        line1: address.line1,
        line2: address.line2,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
      }),
      status: "payment_pending",
      totalMinor,
      razorpayOrderId: razorpayOrder.id,
      orderLines: {
        create: cartLines.map((l) => ({
          variantId: l.variantId,
          setName: l.variant.item.set.name,
          itemName: l.variant.item.name,
          size: l.variant.size,
          category: l.variant.item.category,
          quantity: l.quantity,
          unitPriceMinor: l.variant.item.price,
          totalMinor: l.variant.item.price * l.quantity,
        })),
      },
    },
  });

  return NextResponse.json({
    orderId: order.id,
    orderNumber,
    razorpayOrderId: razorpayOrder.id,
    razorpayKeyId: getRazorpayKeyId(),
    amount: totalMinor,
    currency: "INR",
    prefill: {
      name: address.fullName,
      email: session.user.email,
      contact: address.phone,
    },
  });
}
