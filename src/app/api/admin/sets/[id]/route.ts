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

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const { items, ...setData } = body;

  await prisma.set.update({
    where: { id },
    data: {
      name: setData.name,
      slug: setData.slug,
      tagline: setData.tagline || "",
      description: setData.description || "",
      productDetails: setData.productDetails || "",
      careInstructions: setData.careInstructions || "",
      coverImage: setData.coverImage ?? undefined,
      images: setData.images ?? undefined,
      status: setData.status,
      toneFrom: setData.toneFrom,
      toneTo: setData.toneTo,
      campaignId: setData.campaignId || null,
    },
  });

  if (items) {
    const existingItems = await prisma.item.findMany({ where: { setId: id }, include: { variants: true } });
    const existingIds = new Set(existingItems.map((i) => i.id));
    const incomingIds = new Set(items.filter((i: { id?: string }) => i.id).map((i: { id: string }) => i.id));

    for (const eid of existingIds) {
      if (!incomingIds.has(eid)) {
        await prisma.variant.deleteMany({ where: { itemId: eid } });
        await prisma.item.delete({ where: { id: eid } });
      }
    }

    for (const item of items as { id?: string; name: string; category: string; price: number; image?: string | null; sortOrder: number; variants: { id?: string; size: string; sku: string; stock: number }[] }[]) {
      if (item.id && existingIds.has(item.id)) {
        await prisma.item.update({
          where: { id: item.id },
          data: { name: item.name, category: item.category, price: item.price, image: item.image || null, sortOrder: item.sortOrder },
        });
        const existingVars = existingItems.find((e) => e.id === item.id)?.variants || [];
        const existingVarIds = new Set(existingVars.map((v) => v.id));
        const incomingVarIds = new Set(item.variants.filter((v) => v.id).map((v) => v.id));

        for (const vid of existingVarIds) {
          if (!incomingVarIds.has(vid)) {
            await prisma.variant.delete({ where: { id: vid } });
          }
        }
        for (const v of item.variants) {
          if (v.id && existingVarIds.has(v.id)) {
            await prisma.variant.update({
              where: { id: v.id },
              data: { size: v.size, sku: v.sku, stock: v.stock },
            });
          } else {
            await prisma.variant.create({
              data: { itemId: item.id, size: v.size, sku: v.sku || "", stock: v.stock || 0 },
            });
          }
        }
      } else {
        await prisma.item.create({
          data: {
            setId: id,
            name: item.name,
            category: item.category,
            price: item.price,
            image: item.image || null,
            sortOrder: item.sortOrder,
            variants: {
              create: item.variants.map((v) => ({
                size: v.size,
                sku: v.sku || "",
                stock: v.stock || 0,
              })),
            },
          },
        });
      }
    }
  }

  return NextResponse.json({ ok: true });
}
