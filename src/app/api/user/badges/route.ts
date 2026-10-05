import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const awards = await prisma.badgeAward.findMany({
    where: { userId: session.user.id },
    include: { badge: { select: { name: true, artwork: true } } },
    orderBy: { grantedAt: "desc" },
  });

  return NextResponse.json({
    awards: awards.map((a) => ({
      id: a.id,
      state: a.state,
      badge: {
        name: a.badge.name,
        artwork: a.badge.artwork,
      },
    })),
  });
}
