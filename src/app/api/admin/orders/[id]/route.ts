import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || !["admin", "editor"].includes(session.user.role || "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const { status } = await req.json();

  const updateData: Record<string, unknown> = { status };
  if (status === "delivered") {
    updateData.deliveredAt = new Date();
  }

  await prisma.order.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json({ ok: true });
}
