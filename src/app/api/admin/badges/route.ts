import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user || !["admin", "editor"].includes(session.user.role || "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const badges = await prisma.badge.findMany({
      include: { set: { select: { name: true } } },
    });
    return NextResponse.json({ badges });
  } catch (error) {
    console.error("Failed to fetch badges:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
