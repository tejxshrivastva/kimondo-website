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

  const now = new Date();
  const toSolidify = awards.filter(
    (a) => a.state === "pending" && a.solidifiesAt && a.solidifiesAt <= now
  );

  if (toSolidify.length > 0) {
    await prisma.badgeAward.updateMany({
      where: { id: { in: toSolidify.map((a) => a.id) } },
      data: { state: "solidified" },
    });
  }

  return NextResponse.json({
    awards: awards.map((a) => {
      const solidified =
        a.state === "pending" && a.solidifiesAt && a.solidifiesAt <= now;
      return {
        id: a.id,
        state: solidified ? "solidified" : a.state,
        badge: {
          name: a.badge.name,
          artwork: a.badge.artwork,
        },
      };
    }),
  });
}
