import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SetCard } from "@/components/product/set-card";


export const dynamic = "force-dynamic";
interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const campaign = await prisma.campaign.findUnique({ where: { slug } });
  if (!campaign) return { title: "Not Found" };
  return { title: campaign.title };
}

export default async function CampaignPage({ params }: Props) {
  const { slug } = await params;
  const campaign = await prisma.campaign.findUnique({
    where: { slug, status: "live" },
  });

  if (!campaign) notFound();

  const linkedSets = await prisma.set.findMany({
    where: { campaignId: campaign.id, status: "live" },
    include: { items: true },
  });

  const credits: { role: string; name: string }[] = JSON.parse(
    campaign.credits
  );

  const bodyParagraphs = campaign.body
    ? campaign.body.split("\n").filter((p) => p.trim())
    : [];

  return (
    <div>
      {/* Hero - full bleed */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden">
        {campaign.heroImage ? (
          <img
            src={campaign.heroImage}
            alt={campaign.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[#f0f0f0]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 lg:px-10 pb-12 lg:pb-16">
          <p className="text-[9px] font-semibold tracking-[0.3em] uppercase text-white/50 mb-3">
            {[campaign.location, campaign.date].filter(Boolean).join(" · ") || "The Archive"}
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl text-white max-w-4xl">
            {campaign.title}
          </h1>
          {campaign.subtitle && (
            <p className="mt-4 text-lg lg:text-xl text-white/70 max-w-2xl">
              {campaign.subtitle}
            </p>
          )}
        </div>
      </section>

      {/* Content */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-10">

        {/* Body text - editorial style with drop cap */}
        {bodyParagraphs.length > 0 && (
          <section className="py-16 lg:py-24 max-w-[680px] mx-auto">
            {bodyParagraphs.map((p, i) => (
              <p
                key={i}
                className={`text-[#444] leading-[1.8] text-lg mb-6 last:mb-0 ${
                  i === 0
                    ? "first-letter:text-5xl first-letter:first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:leading-[0.8] first-letter:text-black"
                    : ""
                }`}
              >
                {p}
              </p>
            ))}
          </section>
        )}

        {/* Image gallery - big containers */}
        <section className="pb-16 lg:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="aspect-[3/4] bg-[#f0f0f0] rounded-xl overflow-hidden">
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-[#c0c0c0] text-xs tracking-[0.15em] uppercase">Image</span>
              </div>
            </div>
            <div className="aspect-[3/4] bg-[#f0f0f0] rounded-xl overflow-hidden">
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-[#c0c0c0] text-xs tracking-[0.15em] uppercase">Image</span>
              </div>
            </div>
          </div>
          <div className="mt-4 aspect-[16/7] bg-[#f0f0f0] rounded-xl overflow-hidden">
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-[#c0c0c0] text-xs tracking-[0.15em] uppercase">Image</span>
            </div>
          </div>
        </section>

        {/* Credits */}
        {credits.length > 0 && (
          <section className="border-t border-[rgba(0,0,0,0.08)] py-12 lg:py-16 max-w-[680px] mx-auto">
            <h2 className="text-[9px] font-semibold tracking-[0.3em] uppercase text-muted mb-6">
              Credits
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-8">
              {credits.map((c, i) => (
                <div key={i}>
                  <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#999] mb-1">
                    {c.role}
                  </p>
                  <p className="text-sm font-medium">{c.name}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Linked products */}
        {linkedSets.length > 0 && (
          <section className="border-t border-[rgba(0,0,0,0.08)] py-12 lg:py-16">
            <h2 className="text-[9px] font-semibold tracking-[0.3em] uppercase text-muted mb-8">
              Shop the collection
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8">
              {linkedSets.map((set) => {
                const prices = set.items.map((i) => i.price);
                const minPrice = prices.length > 0 ? Math.min(...prices) : undefined;
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

        {/* Back to archive */}
        <section className="border-t border-[rgba(0,0,0,0.08)] py-12 lg:py-16 text-center">
          <Link
            href="/archive"
            className="inline-flex items-center gap-2 text-sm font-semibold tracking-[0.1em] uppercase text-black hover:opacity-60 transition-opacity"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 3L5 7L9 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to the archive
          </Link>
        </section>
      </div>
    </div>
  );
}
