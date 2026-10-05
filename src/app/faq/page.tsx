import { prisma } from "@/lib/prisma";
import { FaqAccordion } from "./client";

export const metadata = {
  title: "FAQ — Kimondo",
  description: "Frequently asked questions about Kimondo.",
};

export default async function FaqPage() {
  const faqs = await prisma.faq.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="max-w-[720px] mx-auto px-4 sm:px-6 py-8 lg:py-12">
      <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl mb-8 lg:mb-12">
        Questions
      </h1>
      <FaqAccordion faqs={faqs} />
    </div>
  );
}
