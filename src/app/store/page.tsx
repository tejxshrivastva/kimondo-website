export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { SetCard } from "@/components/product/set-card";

export const metadata = {
  title: "Store",
  description: "Browse the Kimondo collection.",
};

export default async function StorePage() {
  const [sets, settings] = await Promise.all([
    prisma.set.findMany({
      where: { status: "live" },
      include: { items: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.siteSettings.findFirst(),
  ]);

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="mb-8 lg:mb-12">
        <p className="text-[9px] font-semibold tracking-[0.2em] uppercase text-muted mb-2">
          The collection
        </p>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl tracking-[0.3px]">
          {settings?.storePageTitle || "Store"}
        </h1>
        <p className="mt-2 text-[#666666] max-w-xl">
          {settings?.storePageSubtitle || "Browse the full collection."}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-6 lg:gap-x-4 lg:gap-y-8">
        {sets.map((set) => {
          const prices = set.items.map((i) => i.price);
          const minPrice = prices.length > 0 ? Math.min(...prices) : undefined;
          return (
            <SetCard
              key={set.id}
              slug={set.slug}
              name={set.name}
              coverImage={set.coverImage || undefined}
              minPrice={minPrice}
              showPrice={false}
            />
          );
        })}
      </div>
    </div>
  );
}
