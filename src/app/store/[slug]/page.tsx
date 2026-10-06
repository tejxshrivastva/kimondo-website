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

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
      {/* Breadcrumb */}
      <Link
        href="/store"
        className="text-sm text-muted hover:text-foreground transition-colors"
      >
        ← Store
      </Link>

      <div className="mt-6 lg:grid lg:grid-cols-[1fr_400px] lg:gap-12">
        {/* Gallery */}
        <div className="space-y-4">
          {/* Hero image */}
          <div
            className="aspect-[4/5] overflow-hidden"
            style={!set.coverImage ? { background: `linear-gradient(150deg, ${set.toneFrom}, ${set.toneTo})` } : undefined}
          >
            {set.coverImage && (
              <img src={set.coverImage} alt={set.name} className="w-full h-full object-cover" />
            )}
          </div>
          {/* Per-item images */}
          {set.items.map((item) => (
            <div key={item.id} className="relative group">
              <div
                className="aspect-[4/5] overflow-hidden"
                style={!item.image ? { background: `linear-gradient(150deg, ${set.toneFrom}dd, ${set.toneTo}dd)` } : undefined}
              >
                {item.image && (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="absolute bottom-4 left-4">
                <SetDetailClient
                  action="itemButton"
                  setSlug={set.slug}
                  itemId={item.id}
                  itemName={item.name}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="mt-8 lg:mt-0 lg:sticky lg:top-24 lg:self-start space-y-6">
          <div>
            <p className="text-[9px] font-semibold tracking-[0.2em] uppercase text-muted mb-2">
              {set.items.length} {set.items.length === 1 ? "piece" : "pieces"}
            </p>
            <h1 className="font-display text-3xl lg:text-4xl">{set.name}</h1>
            <p className="mt-2 text-lg">From {formatPrice(minPrice)}</p>
          </div>

          {/* Shop the set button */}
          <SetDetailClient action="setButton" setSlug={set.slug} />

          {/* Individual item buttons */}
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

          {/* Description */}
          {set.description && (
            <p className="text-[#666666] leading-relaxed">
              {set.description}
            </p>
          )}

          {/* Accordion sections */}
          <SetDetailClient
            action="accordions"
            productDetails={set.productDetails}
            careInstructions={set.careInstructions}
          />

          {/* Campaign link */}
          {set.campaign && (
            <Link
              href={`/archive/${set.campaign.slug}`}
              className="block text-sm font-medium underline underline-offset-4"
            >
              Read the campaign →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
