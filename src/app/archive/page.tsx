import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Archive | Kimondo",
  description: "Browse the Kimondo archive.",
};

export default async function ArchivePage() {
  const campaigns = await prisma.campaign.findMany({
    where: { status: "live" },
    orderBy: { sortOrder: "asc" },
  });

  const featured = campaigns[0];
  const rest = campaigns.slice(1);

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="mb-10 lg:mb-16">
        <p className="text-[9px] font-semibold tracking-[0.2em] uppercase text-muted mb-2">
          Stories behind the cloth
        </p>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-[0.3px]">
          The Archive
        </h1>
      </div>

      {/* Featured story - full width */}
      {featured && (
        <Link href={`/archive/${featured.slug}`} className="group block mb-12 lg:mb-20">
          <div className="relative aspect-[16/7] bg-[#f0f0f0] rounded-xl overflow-hidden">
            {featured.heroImage ? (
              <img
                src={featured.heroImage}
                alt={featured.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-[#c0c0c0] text-xs tracking-[0.15em] uppercase">Image</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10">
              <p className="text-[9px] font-semibold tracking-[0.3em] uppercase text-white/50 mb-2">
                {[featured.location, featured.date].filter(Boolean).join(" · ") || "Featured"}
              </p>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-white">
                {featured.title}
              </h2>
              {featured.subtitle && (
                <p className="mt-2 text-white/60 text-sm lg:text-base max-w-xl">
                  {featured.subtitle}
                </p>
              )}
            </div>
          </div>
        </Link>
      )}

      {/* Grid */}
      {rest.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10 lg:gap-x-6 lg:gap-y-14">
          {rest.map((c) => (
            <Link
              key={c.id}
              href={`/archive/${c.slug}`}
              className="group block"
            >
              <div className="aspect-[4/5] bg-[#f0f0f0] rounded-xl overflow-hidden mb-3">
                {c.heroImage ? (
                  <img
                    src={c.heroImage}
                    alt={c.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-[#c0c0c0] text-xs tracking-[0.15em] uppercase">Image</span>
                  </div>
                )}
              </div>
              <p className="text-[9px] font-semibold tracking-[0.2em] uppercase text-[#999] mb-1">
                {[c.location, c.date].filter(Boolean).join(" · ")}
              </p>
              <h2 className="font-display text-xl">{c.title}</h2>
              {c.subtitle && (
                <p className="text-xs text-[#999] mt-1 line-clamp-2">{c.subtitle}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
