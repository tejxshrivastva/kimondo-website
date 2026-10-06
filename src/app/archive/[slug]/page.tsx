import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const campaign = await prisma.campaign.findUnique({ where: { slug } });
  if (!campaign) return { title: "Not Found — Kimondo" };
  return { title: `${campaign.title} — Kimondo` };
}

export default async function CampaignPage({ params }: Props) {
  const { slug } = await params;
  const campaign = await prisma.campaign.findUnique({
    where: { slug, status: "live" },
  });

  if (!campaign) notFound();

  const linkedSets = await prisma.set.findMany({
    where: { campaignId: campaign.id, status: "live" },
  });

  const credits: { role: string; name: string }[] = JSON.parse(
    campaign.credits
  );

  return (
    <div>
      {/* Hero */}
      <section className="relative px-4 py-20 lg:py-32 text-center bg-surface overflow-hidden">
        {campaign.heroImage && (
          <img src={campaign.heroImage} alt={campaign.title} className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="relative">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl max-w-3xl mx-auto">
            {campaign.title}
          </h1>
          <p className="mt-3 text-muted text-lg">
            {[campaign.location, campaign.date].filter(Boolean).join(" · ")}
          </p>
        </div>
      </section>

      {/* Body */}
      <div className="max-w-[720px] mx-auto px-4 sm:px-6 py-12 lg:py-16">
        {campaign.body && (
          <div className="text-[#666666] leading-relaxed text-lg whitespace-pre-line">
            {campaign.body}
          </div>
        )}

        {/* Image placeholders */}
        <div className="grid grid-cols-2 gap-4 my-10">
          <div className="aspect-[3/4] bg-surface" />
          <div className="aspect-[3/4] bg-surface" />
        </div>

        {/* Credits */}
        {credits.length > 0 && (
          <div className="border-t border-[rgba(0,0,0,0.1)] pt-8 mt-8">
            <h2 className="text-[9px] font-semibold tracking-[0.2em] uppercase text-muted mb-4">
              Credits
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {credits.map((c, i) => (
                <div key={i}>
                  <p className="text-xs text-muted uppercase tracking-wider">
                    {c.role}
                  </p>
                  <p className="text-sm font-medium mt-0.5">{c.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Linked sets */}
        {linkedSets.map((set) => (
          <Link
            key={set.id}
            href={`/store/${set.slug}`}
            className="mt-8 block w-full h-12 bg-black text-white text-sm font-semibold hover:bg-black/90 transition-colors flex items-center justify-center"
          >
            Shop the {set.name} set
          </Link>
        ))}
      </div>
    </div>
  );
}
