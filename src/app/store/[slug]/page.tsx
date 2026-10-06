import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { SetDetailClient } from "./client";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const set = await prisma.set.findUnique({ where: { slug } });
  if (!set) return { title: "Not Found — Kimondo" };
  return {
    title: `${set.name} — Kimondo`,
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

  const sliderImages = set.items.map((item) => ({
    id: item.id,
    name: item.name,
    image: item.image,
  }));

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
      <Link
        href="/store"
        className="text-sm text-muted hover:text-foreground transition-colors"
      >
        ← Store
      </Link>

      <div className="mt-6 lg:grid lg:grid-cols-3 lg:gap-6">
        {/* Column 1: Static hero image */}
        <div>
          <div
            className="aspect-[4/5] overflow-hidden sticky top-24"
            style={!set.coverImage ? { background: `linear-gradient(150deg, ${set.toneFrom}, ${set.toneTo})` } : undefined}
          >
            {set.coverImage && (
              <img src={set.coverImage} alt={set.name} className="w-full h-full object-cover" />
            )}
          </div>
        </div>

        {/* Column 2: Image slider (per-item images) */}
        <div>
          <SetDetailClient
            action="imageSlider"
            setSlug={set.slug}
            sliderImages={sliderImages}
            toneFrom={set.toneFrom}
            toneTo={set.toneTo}
          />
        </div>

        {/* Column 3: Product details */}
        <div className="mt-8 lg:mt-0 space-y-6">
          <div>
            <p className="text-[9px] font-semibold tracking-[0.2em] uppercase text-muted mb-2">
              {set.items.length} {set.items.length === 1 ? "piece" : "pieces"}
            </p>
            <h1 className="font-display text-3xl lg:text-4xl">{set.name}</h1>
            <p className="mt-2 text-lg">From {formatPrice(minPrice)}</p>
          </div>

          <SetDetailClient action="setButton" setSlug={set.slug} />

          <div className="space-y-2">
            {set.items.map((item) => (
              <SetDetailClient
                key={item.id}
                action="itemRow"
                setSlug={set.slug}
                itemId={item.id}
                itemName={item.name}
                itemCategory={item.category}
                itemPrice={item.price}
              />
            ))}
          </div>

          {set.description && (
            <p className="text-[#666666] leading-relaxed">
              {set.description}
            </p>
          )}

          <SetDetailClient
            action="accordions"
            productDetails={set.productDetails}
            careInstructions={set.careInstructions}
          />

          {set.campaign && (
            <Link
              href={`/archive/${set.campaign.slug}`}
              className="block text-sm font-medium underline underline-offset-4"
            >
              Read the story →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
