import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";

export default async function AdminCampaignsPage() {
  const campaigns = await prisma.campaign.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { sets: true } } },
  });

  return (
    <div className="px-[clamp(14px,3vw,34px)] py-[clamp(18px,3vw,30px)]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-light">Archive stories</h1>
        <Link
          href="/admin/campaigns/new"
          className="flex items-center gap-2 h-10 px-4 bg-black text-white text-sm font-semibold"
        >
          <Plus size={16} /> New story
        </Link>
      </div>
      <div className="space-y-3">
        {campaigns.map((c) => (
          <Link
            key={c.id}
            href={`/admin/campaigns/${c.id}`}
            className="block border border-[rgba(0,0,0,0.12)] p-4 hover:bg-[#f8f8f8]/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{c.title}</p>
                <p className="text-xs text-muted mt-0.5">{c.location} · {c._count.sets} products linked</p>
              </div>
              <span className={`text-xs px-2 py-0.5 ${c.status === "published" ? "bg-black text-white" : "bg-[#f8f8f8] text-[#666666]"}`}>
                {c.status}
              </span>
            </div>
          </Link>
        ))}
        {campaigns.length === 0 && (
          <p className="text-center py-12 text-muted">No campaigns yet</p>
        )}
      </div>
    </div>
  );
}
