import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const campaign = await prisma.campaign.findUnique({ where: { id } });
  if (!campaign) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    campaign: {
      ...campaign,
      credits: JSON.parse(campaign.credits || "[]"),
    },
  });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user || !["admin", "editor"].includes(session.user.role || "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();

  await prisma.campaign.update({
    where: { id },
    data: {
      title: body.title,
      slug: body.slug,
      subtitle: body.subtitle || "",
      body: body.body || "",
      location: body.location || "",
      date: body.date || "",
      credits: JSON.stringify(body.credits || []),
      status: body.status,
    },
  });

  return NextResponse.json({ ok: true });
}
