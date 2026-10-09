import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const notifyRequests = await prisma.notifyRequest.findMany({
      include: {
        user: { select: { email: true } },
        variant: {
          select: {
            size: true,
            sku: true,
            item: {
              select: {
                name: true,
                set: { select: { name: true } },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ notifyRequests });
  } catch (error) {
    console.error("Failed to fetch notify requests:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
