import { prisma } from "@/lib/prisma";

export default async function AdminBadgesPage() {
  const badges = await prisma.badge.findMany({
    include: {
      _count: { select: { awards: true } },
      set: { select: { name: true } },
    },
  });

  return (
    <div className="px-[clamp(14px,3vw,34px)] py-[clamp(18px,3vw,30px)]">
      <h1 className="font-display text-2xl mb-6">Badges</h1>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {badges.map((badge) => (
          <div key={badge.id} className="border border-[rgba(0,0,0,0.12)] rounded-[12px] p-4 text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-surface flex items-center justify-center text-2xl">
              {badge.artwork || "🏷"}
            </div>
            <p className="text-sm font-medium">{badge.name}</p>
            {badge.set && <p className="text-xs text-muted mt-0.5">{badge.set.name}</p>}
            <p className="text-xs text-muted mt-1">{badge._count.awards} awarded</p>
          </div>
        ))}
        {badges.length === 0 && <p className="col-span-3 text-center py-12 text-muted">No badges yet</p>}
      </div>
    </div>
  );
}
