import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { variantId } = await req.json();
  if (!variantId) {
    return NextResponse.json({ error: "variantId required" }, { status: 400 });
  }

  const existing = await prisma.notifyRequest.findFirst({
    where: { userId: session.user.id, variantId },
  });
  if (existing) {
    return NextResponse.json({ ok: true, already: true });
  }

  await prisma.notifyRequest.create({
    data: {
      userId: session.user.id,
      variantId,
      email: session.user.email || "",
    },
  });

  return NextResponse.json({ ok: true });
}
