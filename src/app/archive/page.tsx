import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Archive — Kimondo",
  description: "Stories behind the cloth.",
};

export default async function ArchivePage() {
  const campaigns = await prisma.campaign.findMany({
    where: { status: "live" },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-[0.3px] mb-8 lg:mb-12">
        The archive
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((c) => (
          <Link
            key={c.id}
            href={`/archive/${c.slug}`}
            className="group block"
          >
            <div className="aspect-[3/2] bg-surface mb-3" />
            <h2 className="font-display text-xl group-hover:underline">
              {c.title}
            </h2>
            <p className="text-sm text-muted mt-1">
              {[c.location, c.date].filter(Boolean).join(" · ")}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
