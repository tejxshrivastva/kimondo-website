import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const sets = await prisma.set.findMany({
    select: { id: true, name: true, slug: true },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json({ sets });
}
