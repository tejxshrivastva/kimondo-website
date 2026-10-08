import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Archive",
  description: "Browse the Kimondo archive.",
};

export default async function ArchivePage() {
  const [campaigns, settings] = await Promise.all([
    prisma.campaign.findMany({
      where: { status: "live" },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.siteSettings.findFirst(),
  ]);

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="mb-10 lg:mb-16">
        <p className="text-[9px] font-semibold tracking-[0.2em] uppercase text-muted mb-2">
          Stories behind the cloth
        </p>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-[0.3px]">
          {settings?.archivePageTitle || "The Archive"}
        </h1>
        {settings?.archivePageSubtitle && (
          <p className="mt-2 text-[#666666] max-w-xl">
            {settings.archivePageSubtitle}
          </p>
        )}
      </div>

      {campaigns.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10 lg:gap-x-6 lg:gap-y-14">
          {campaigns.map((c) => (
            <Link
              key={c.id}
              href={`/archive/${c.slug}`}
              className="group block"
            >
              <div className="aspect-[4/5] bg-[#f0f0f0] overflow-hidden mb-3">
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
