import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const faqs = await prisma.faq.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ faqs });
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user || !["admin", "editor"].includes(session.user.role || "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { faqs } = await req.json();

  await prisma.faq.deleteMany();
  await prisma.faq.createMany({
    data: (faqs as { question: string; answer: string; section: string; sortOrder: number }[]).map((f, i) => ({
      question: f.question,
      answer: f.answer,
      section: f.section || "General",
      sortOrder: i,
    })),
  });

  return NextResponse.json({ ok: true });
}
