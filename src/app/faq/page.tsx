import { prisma } from "@/lib/prisma";
import { FaqAccordion } from "./client";


export const dynamic = "force-dynamic";
export const metadata = {
  title: "FAQ",
  description: "Frequently asked questions about Kimondo.",
};

export default async function FaqPage() {
  const [faqs, settings] = await Promise.all([
    prisma.faq.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.siteSettings.findFirst(),
  ]);

  return (
    <div className="max-w-[720px] mx-auto px-4 sm:px-6 py-8 lg:py-12">
      <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-[0.3px] mb-8 lg:mb-12">
        {settings?.faqPageTitle || "Questions we hear often"}
      </h1>
      <FaqAccordion faqs={faqs} />
    </div>
  );
}
