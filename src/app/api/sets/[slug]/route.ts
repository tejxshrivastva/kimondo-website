import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const set = await prisma.set.findUnique({
    where: { slug },
    include: {
      items: {
        include: { variants: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!set) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: set.id,
    name: set.name,
    slug: set.slug,
    items: set.items.map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      price: item.price,
      variants: item.variants.map((v) => ({
        id: v.id,
        size: v.size,
        stock: v.stock,
      })),
    })),
  });
}
