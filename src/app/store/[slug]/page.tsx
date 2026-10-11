import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductPageClient } from "./product-page-client";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const set = await prisma.set.findUnique({ where: { slug } });
  if (!set) return { title: "Not Found" };
  return {
    title: set.name,
    description: set.description?.slice(0, 160) || `The ${set.name} set.`,
  };
}

export default async function SetPage({ params }: Props) {
  const { slug } = await params;
  const set = await prisma.set.findUnique({
    where: { slug, status: "live" },
    include: {
      items: {
        include: { variants: true },
        orderBy: { sortOrder: "asc" },
      },
      campaign: true,
    },
  });

  if (!set) notFound();

  const prices = set.items.map((i) => i.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const setImages: string[] = JSON.parse(set.images || "[]");

  return (
    <ProductPageClient
      set={{
        name: set.name,
        description: set.description,
        tagline: set.tagline,
        coverImage: set.coverImage,
        productDetails: set.productDetails,
        careInstructions: set.careInstructions,
        minPrice,
        images: setImages,
        campaign: set.campaign
          ? {
              slug: set.campaign.slug,
              subtitle: set.campaign.subtitle,
              location: set.campaign.location,
              date: set.campaign.date,
            }
          : null,
      }}
    />
  );
}
