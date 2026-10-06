import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { POLICY_SLUGS } from "@/lib/constants";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const policy = await prisma.policy.findUnique({ where: { slug } });
  if (!policy) return { title: "Not Found — Kimondo" };
  return { title: `${policy.title} — Kimondo` };
}

export default async function PolicyPage({ params }: Props) {
  const { slug } = await params;

  if (!POLICY_SLUGS.includes(slug as (typeof POLICY_SLUGS)[number])) {
    notFound();
  }

  const policy = await prisma.policy.findUnique({ where: { slug } });
  if (!policy) notFound();

  const allPolicies = await prisma.policy.findMany({
    orderBy: { slug: "asc" },
  });

  return (
    <div className="max-w-[680px] mx-auto px-4 sm:px-6 py-8 lg:py-12">
      <h1 className="font-display text-3xl sm:text-4xl mb-8">{policy.title}</h1>

      <div className="text-[#666666] leading-relaxed whitespace-pre-line">
        {policy.body}
      </div>

      {/* Policy nav */}
      <nav className="border-t border-[rgba(0,0,0,0.1)] mt-12 pt-8">
        <p className="text-[9px] font-semibold tracking-[0.2em] uppercase text-muted mb-3">
          Policies
        </p>
        <div className="flex flex-wrap gap-3">
          {allPolicies.map((p) => (
            <Link
              key={p.slug}
              href={`/policy/${p.slug}`}
              className={`text-sm ${
                p.slug === slug
                  ? "font-semibold"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {p.title.replace(" Policy", "")}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
