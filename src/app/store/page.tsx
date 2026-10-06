export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { SetCard } from "@/components/product/set-card";

export const metadata = {
  title: "Store — Kimondo",
  description: "Every piece carries the mark of its maker — thread, loom, time.",
};

export default async function StorePage() {
  const sets = await prisma.set.findMany({
    where: { status: "live" },
    include: { items: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="mb-8 lg:mb-12">
        <p className="text-[9px] font-semibold tracking-[0.2em] uppercase text-muted mb-2">
          The collection
        </p>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-[0.3px]">
          Store
        </h1>
        <p className="mt-2 text-[#666666] max-w-xl">
          Every piece carries the mark of its maker — thread, loom, time.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {sets.map((set) => (
          <SetCard
            key={set.id}
            slug={set.slug}
            name={set.name}
            tagline={set.tagline}
            coverImage={set.coverImage || undefined}
            toneFrom={set.toneFrom}
            toneTo={set.toneTo}
            showPrice={false}
          />
        ))}
      </div>
    </div>
  );
}
