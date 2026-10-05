export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SetCard } from "@/components/product/set-card";

export default async function HomePage() {
  const homepage = await prisma.homepageSetting.findFirst();
  const sets = await prisma.set.findMany({
    where: { status: "live" },
    include: { items: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <>
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-4 py-24 lg:py-40">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(180deg, #f5f5f5 0%, #ffffff 100%)",
          }}
        />
        <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl tracking-tight max-w-3xl">
          Lorem ipsum dolor sit amet
        </h1>
        <p className="mt-4 text-muted text-lg max-w-xl font-body">
          Consectetur adipiscing elit, sed do eiusmod tempor
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link
            href="/store"
            className="inline-flex items-center justify-center h-12 px-8 bg-black text-white text-sm font-semibold rounded-[12px] hover:bg-black/90 transition-colors"
          >
            {homepage?.ctaLabel || "Lorem ipsum"}
          </Link>
          <Link
            href="/archive"
            className="inline-flex items-center justify-center h-12 px-8 border border-black text-sm font-semibold rounded-[12px] hover:bg-black hover:text-white transition-colors"
          >
            Dolor sit amet
          </Link>
        </div>
      </section>

      {/* Featured Sets */}
      {sets.length > 0 && (
        <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[9px] font-semibold tracking-[0.2em] uppercase text-muted">
              The collection
            </h2>
            <Link
              href="/store"
              className="text-sm font-medium underline underline-offset-4"
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {sets.map((set) => {
              const prices = set.items.map((i) => i.price);
              const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
              return (
                <SetCard
                  key={set.id}
                  slug={set.slug}
                  name={set.name}
                  tagline={set.tagline}
                  toneFrom={set.toneFrom}
                  toneTo={set.toneTo}
                  minPrice={minPrice}
                  itemCount={set.items.length}
                />
              );
            })}
          </div>
        </section>
      )}
    </>
  );
}
