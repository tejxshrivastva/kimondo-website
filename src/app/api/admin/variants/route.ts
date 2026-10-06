import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || !["admin", "editor"].includes(session.user.role || "")) {
    return null;
  }
  return session;
}

export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { itemId, size, sku, stock } = await req.json();

    if (!itemId || !size || !sku) {
      return NextResponse.json({ error: "itemId, size, and sku are required" }, { status: 400 });
    }

    const variant = await prisma.variant.create({
      data: {
        itemId,
        size,
        sku,
        stock: stock ?? 0,
      },
    });

    return NextResponse.json({ variant });
  } catch (error) {
    console.error("Failed to create variant:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id, size, sku, stock } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const data: Record<string, unknown> = {};
    if (size !== undefined) data.size = size;
    if (sku !== undefined) data.sku = sku;
    if (stock !== undefined) data.stock = stock;

    const variant = await prisma.variant.update({ where: { id }, data });
    return NextResponse.json({ variant });
  } catch (error) {
    console.error("Failed to update variant:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    await prisma.variant.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete variant:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
