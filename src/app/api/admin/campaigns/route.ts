import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || !["admin", "editor"].includes(session.user.role || "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const campaign = await prisma.campaign.create({
    data: {
      title: body.title,
      slug: body.slug,
      subtitle: body.subtitle || "",
      body: body.body || "",
      location: body.location || "",
      date: body.date || "",
      credits: JSON.stringify(body.credits || []),
      status: body.status || "draft",
    },
  });

  return NextResponse.json({ campaign });
}
