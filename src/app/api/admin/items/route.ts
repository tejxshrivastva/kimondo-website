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
    const { setId, name, category, price, sortOrder } = await req.json();

    if (!setId || !name || !category || price == null) {
      return NextResponse.json({ error: "setId, name, category, and price are required" }, { status: 400 });
    }

    const validCategories = ["top", "bottom", "accessory"];
    if (!validCategories.includes(category)) {
      return NextResponse.json({ error: "Category must be top, bottom, or accessory" }, { status: 400 });
    }

    const item = await prisma.item.create({
      data: {
        setId,
        name,
        category,
        price,
        sortOrder: sortOrder ?? 0,
      },
    });

    return NextResponse.json({ item });
  } catch (error) {
    console.error("Failed to create item:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id, name, category, price, sortOrder } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    if (category) {
      const validCategories = ["top", "bottom", "accessory"];
      if (!validCategories.includes(category)) {
        return NextResponse.json({ error: "Category must be top, bottom, or accessory" }, { status: 400 });
      }
    }

    const data: Record<string, unknown> = {};
    if (name !== undefined) data.name = name;
    if (category !== undefined) data.category = category;
    if (price !== undefined) data.price = price;
    if (sortOrder !== undefined) data.sortOrder = sortOrder;

    const item = await prisma.item.update({ where: { id }, data });
    return NextResponse.json({ item });
  } catch (error) {
    console.error("Failed to update item:", error);
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

    await prisma.item.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete item:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
