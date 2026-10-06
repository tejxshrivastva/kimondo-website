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

  const body = await req.json();
  const { name, slug, tagline, description, productDetails, careInstructions, coverImage, images, status, toneFrom, toneTo, campaignId, badgeId, items } = body;

  const set = await prisma.set.create({
    data: {
      name,
      slug,
      tagline: tagline || "",
      description: description || "",
      productDetails: productDetails || "",
      careInstructions: careInstructions || "",
      coverImage: coverImage || "",
      images: images || "[]",
      status: status || "draft",
      toneFrom: toneFrom || "#e8d5b7",
      toneTo: toneTo || "#c4a882",
      campaignId: campaignId || null,
      items: {
        create: (items || []).map((item: { name: string; category: string; price: number; image?: string; sortOrder: number; variants: { size: string; sku: string; stock: number }[] }) => ({
          name: item.name,
          category: item.category,
          price: item.price,
          image: item.image || null,
          sortOrder: item.sortOrder,
          variants: {
            create: (item.variants || []).map((v: { size: string; sku: string; stock: number }) => ({
              size: v.size,
              sku: v.sku || "",
              stock: v.stock || 0,
            })),
          },
        })),
      },
    },
  });

  return NextResponse.json({ set });
}
