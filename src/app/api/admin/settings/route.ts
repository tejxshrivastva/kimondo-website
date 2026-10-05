import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const settings = await prisma.siteSettings.findFirst();
  if (!settings) return NextResponse.json({ settings: null });

  return NextResponse.json({
    settings: {
      ...settings,
      socialLinks: JSON.parse(settings.socialLinks || "{}"),
    },
  });
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const existing = await prisma.siteSettings.findFirst();

  const data = {
    returnWindowDays: body.returnWindowDays ?? 14,
    exchangeWindowDays: body.exchangeWindowDays ?? 14,
    founderEmail: body.founderEmail || "",
    socialLinks: JSON.stringify(body.socialLinks || {}),
  };

  if (existing) {
    await prisma.siteSettings.update({ where: { id: existing.id }, data });
  } else {
    await prisma.siteSettings.create({ data });
  }

  return NextResponse.json({ ok: true });
}
