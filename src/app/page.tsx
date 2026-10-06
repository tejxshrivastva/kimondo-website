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
      <section className="relative flex flex-col items-center justify-center text-center px-4 py-32 lg:py-48 bg-[#f8f8f8]">
        <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl tracking-[0.3px] max-w-3xl">
          Woven by hand. Worn with intention.
        </h1>
        <p className="mt-4 text-[#666666] text-lg max-w-xl">
          Each garment begins as raw yarn on a traditional loom and arrives as a finished thought.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link
            href="/store"
            className="inline-flex items-center justify-center h-12 px-8 bg-black text-white text-sm font-semibold tracking-[0.2px] hover:bg-black/90 transition-colors"
          >
            {homepage?.ctaLabel || "Enter the collection"}
          </Link>
          <Link
            href="/archive"
            className="inline-flex items-center justify-center h-12 px-8 border border-black text-sm font-semibold hover:bg-black hover:text-white transition-colors"
          >
            The archive
          </Link>
        </div>
      </section>

      {/* Featured Sets */}
      {sets.length > 0 && (
        <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-16 lg:pb-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-[9px] font-semibold tracking-[0.3em] uppercase text-muted">
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
                  coverImage={set.coverImage || undefined}
                  minPrice={minPrice}
                />
              );
            })}
          </div>
        </section>
      )}
    </>
  );
}
