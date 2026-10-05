import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";

export default async function AdminCampaignsPage() {
  const campaigns = await prisma.campaign.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { sets: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl">Campaigns</h1>
        <Link
          href="/admin/campaigns/new"
          className="flex items-center gap-2 h-10 px-4 bg-black text-white text-sm font-semibold rounded-[12px]"
        >
          <Plus size={16} /> New campaign
        </Link>
      </div>
      <div className="space-y-3">
        {campaigns.map((c) => (
          <Link
            key={c.id}
            href={`/admin/campaigns/${c.id}`}
            className="block border border-[rgba(0,0,0,0.12)] rounded-[12px] p-4 hover:bg-surface/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{c.title}</p>
                <p className="text-xs text-muted mt-0.5">{c.location} · {c._count.sets} sets</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${c.status === "published" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
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
