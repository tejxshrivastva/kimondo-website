import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json({ addresses });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { label, fullName, phone, line1, line2, city, state, pincode, isDefault } = body;

  if (!fullName || !phone || !line1 || !city || !state || !pincode) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false },
    });
  }

  const existing = await prisma.address.count({ where: { userId: session.user.id } });

  const address = await prisma.address.create({
    data: {
      userId: session.user.id,
      label: label || "Home",
      fullName,
      phone,
      line1,
      line2: line2 || "",
      city,
      state,
      pincode,
      isDefault: isDefault || existing === 0,
    },
  });

  return NextResponse.json({ address });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { id, ...updates } = body;

  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  const address = await prisma.address.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!address) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (updates.isDefault) {
    await prisma.address.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false },
    });
  }

  const updated = await prisma.address.update({
    where: { id },
    data: updates,
  });

  return NextResponse.json({ address: updated });
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  await prisma.address.deleteMany({
    where: { id, userId: session.user.id },
  });

  return NextResponse.json({ ok: true });
}
