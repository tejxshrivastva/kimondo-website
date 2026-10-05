import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sizes = await prisma.savedSize.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ sizes });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { label, isSelf, topSize, bottomSize } = await req.json();
  if (!label || !topSize || !bottomSize) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const size = await prisma.savedSize.create({
    data: {
      userId: session.user.id,
      label,
      isSelf: isSelf ?? true,
      topSize,
      bottomSize,
    },
  });

  return NextResponse.json({ size });
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();
  await prisma.savedSize.deleteMany({
    where: { id, userId: session.user.id },
  });

  return NextResponse.json({ ok: true });
}
