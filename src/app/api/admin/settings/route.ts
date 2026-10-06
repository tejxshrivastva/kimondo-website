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

  const data: Record<string, unknown> = {};
  if (body.returnWindowDays !== undefined) data.returnWindowDays = body.returnWindowDays;
  if (body.exchangeWindowDays !== undefined) data.exchangeWindowDays = body.exchangeWindowDays;
  if (body.founderEmail !== undefined) data.founderEmail = body.founderEmail;
  if (body.founderPageTitle !== undefined) data.founderPageTitle = body.founderPageTitle;
  if (body.founderPageSubtitle !== undefined) data.founderPageSubtitle = body.founderPageSubtitle;
  if (body.storePageTitle !== undefined) data.storePageTitle = body.storePageTitle;
  if (body.storePageSubtitle !== undefined) data.storePageSubtitle = body.storePageSubtitle;
  if (body.archivePageTitle !== undefined) data.archivePageTitle = body.archivePageTitle;
  if (body.archivePageSubtitle !== undefined) data.archivePageSubtitle = body.archivePageSubtitle;
  if (body.faqPageTitle !== undefined) data.faqPageTitle = body.faqPageTitle;
  if (body.socialLinks !== undefined) data.socialLinks = JSON.stringify(body.socialLinks);

  if (existing) {
    await prisma.siteSettings.update({ where: { id: existing.id }, data });
  } else {
    await prisma.siteSettings.create({ data });
  }

  return NextResponse.json({ ok: true });
}
