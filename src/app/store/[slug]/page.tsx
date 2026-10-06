import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { SetDetailClient } from "./client";
import { ProductDetailsColumn } from "./product-details-column";
import { SetCard } from "@/components/product/set-card";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const set = await prisma.set.findUnique({ where: { slug } });
  if (!set) return { title: "Not Found | Kimondo" };
  return {
    title: `${set.name} | Kimondo`,
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

  const recommendations = await prisma.set.findMany({
    where: { status: "live", slug: { not: slug } },
    include: { items: true },
    orderBy: { sortOrder: "asc" },
    take: 6,
  });

  return (
    <div className="max-w-[1600px] mx-auto">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <Link
          href="/store"
          className="text-sm text-muted hover:text-foreground transition-colors"
        >
          ← Store
        </Link>
      </div>

      <div className="lg:grid lg:grid-cols-3">
        {/* Column 1: Static hero image - sticky, fills viewport */}
        <div className="lg:sticky lg:top-0 lg:h-screen">
          <div
            className="w-full h-full overflow-hidden bg-[#f0f0f0]"
            style={!set.coverImage ? { background: `linear-gradient(150deg, ${set.toneFrom}, ${set.toneTo})` } : undefined}
          >
            {set.coverImage ? (
              <img src={set.coverImage} alt={set.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-[#c0c0c0] text-xs tracking-[0.15em] uppercase">Cover image</span>
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Vertical image scroll - flows naturally */}
        <div>
          {set.items.map((item) => (
            <div key={item.id} className="w-full overflow-hidden" style={{ aspectRatio: "4/5" }}>
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center bg-[#f0f0f0]"
                >
                  <span className="text-[#c0c0c0] text-xs tracking-[0.15em] uppercase">{item.name}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Column 3: Product details - sticky until hovered, then scrollable */}
        <ProductDetailsColumn>
          <div className="px-6 lg:px-8 py-8 space-y-6">
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
        </ProductDetailsColumn>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 py-16 lg:py-24 border-t border-[rgba(0,0,0,0.08)]">
          <h2 className="text-[9px] font-semibold tracking-[0.3em] uppercase text-muted mb-8">
            You may also like
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-6 lg:gap-x-4 lg:gap-y-8">
            {recommendations.map((rec) => {
              const recPrices = rec.items.map((i) => i.price);
              const recMin = recPrices.length > 0 ? Math.min(...recPrices) : undefined;
              return (
                <SetCard
                  key={rec.id}
                  slug={rec.slug}
                  name={rec.name}
                  coverImage={rec.coverImage || undefined}
                  minPrice={recMin}
                />
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
