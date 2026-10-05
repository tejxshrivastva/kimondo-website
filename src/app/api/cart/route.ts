import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ lines: [] });
  }

  const lines = await prisma.cartLine.findMany({
    where: { userId: session.user.id },
    include: {
      variant: {
        include: {
          item: {
            include: { set: { select: { name: true, slug: true, toneFrom: true, toneTo: true } } },
          },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const mapped = lines.map((l) => ({
    id: l.id,
    variantId: l.variantId,
    setSlug: l.variant.item.set.slug,
    setName: l.variant.item.set.name,
    itemName: l.variant.item.name,
    category: l.variant.item.category,
    size: l.variant.size,
    price: l.variant.item.price,
    quantity: l.quantity,
    stock: l.variant.stock,
    toneFrom: l.variant.item.set.toneFrom,
    toneTo: l.variant.item.set.toneTo,
  }));

  return NextResponse.json({ lines: mapped });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { variantId, setId } = await req.json();
  if (!variantId) {
    return NextResponse.json({ error: "variantId required" }, { status: 400 });
  }

  const variant = await prisma.variant.findUnique({
    where: { id: variantId },
    include: { item: true },
  });
  if (!variant || variant.stock < 1) {
    return NextResponse.json({ error: "Out of stock" }, { status: 400 });
  }

  const line = await prisma.cartLine.upsert({
    where: {
      userId_variantId: {
        userId: session.user.id,
        variantId,
      },
    },
    update: { quantity: { increment: 1 } },
    create: {
      userId: session.user.id,
      variantId,
      setId: setId || variant.item.setId,
      quantity: 1,
    },
  });

  return NextResponse.json({ line });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { lineId, quantity } = await req.json();
  if (!lineId || typeof quantity !== "number" || quantity < 1) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const line = await prisma.cartLine.findFirst({
    where: { id: lineId, userId: session.user.id },
  });
  if (!line) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.cartLine.update({
    where: { id: lineId },
    data: { quantity },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { lineId } = await req.json();
  if (!lineId) {
    return NextResponse.json({ error: "lineId required" }, { status: 400 });
  }

  await prisma.cartLine.deleteMany({
    where: { id: lineId, userId: session.user.id },
  });

  return NextResponse.json({ ok: true });
}
