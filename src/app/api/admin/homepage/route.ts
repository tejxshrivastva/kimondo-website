import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const settings = await prisma.homepageSetting.findFirst();
  if (!settings) return NextResponse.json({ settings: null });

  return NextResponse.json({
    settings: {
      ...settings,
      featuredSetIds: JSON.parse(settings.featuredSetIds || "[]"),
    },
  });
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user || !["admin", "editor"].includes(session.user.role || "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const existing = await prisma.homepageSetting.findFirst();

  const data = {
    heroImage: body.heroImage || "",
    heroImageMobile: body.heroImageMobile || "",
    heroVideo: body.heroVideo || "",
    ctaLabel: body.ctaLabel || "",
    ctaTarget: body.ctaTarget || "",
    featuredSetIds: JSON.stringify(body.featuredSetIds || []),
  };

  if (existing) {
    await prisma.homepageSetting.update({ where: { id: existing.id }, data });
  } else {
    await prisma.homepageSetting.create({ data });
  }

  return NextResponse.json({ ok: true });
}
