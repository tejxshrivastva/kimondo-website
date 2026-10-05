import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { SetEditor } from "./editor";

export default async function AdminSetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (id === "new") {
    return <SetEditor set={null} campaigns={await prisma.campaign.findMany()} badges={await prisma.badge.findMany()} />;
  }

  const raw = await prisma.set.findUnique({
    where: { id },
    include: {
      items: {
        include: { variants: true },
        orderBy: { sortOrder: "asc" },
      },
      badge: true,
    },
  });

  if (!raw) notFound();

  const set = { ...raw, badgeId: raw.badge?.id ?? null };

  const [campaigns, badges] = await Promise.all([
    prisma.campaign.findMany(),
    prisma.badge.findMany(),
  ]);

  return <SetEditor set={set} campaigns={campaigns} badges={badges} />;
}
