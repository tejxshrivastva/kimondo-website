import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isResendLive } from "@/lib/resend";
import { Resend } from "resend";

export async function POST(req: Request) {
  try {
    const { message, email } = await req.json();
    if (!message || !email) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const settings = await prisma.siteSettings.findFirst();
    const founderEmail = settings?.founderEmail || "hello@kimondo.in";

    if (isResendLive) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const fromEmail = process.env.RESEND_FROM_EMAIL || "Kimondo <noreply@kimondo.in>";
      await resend.emails.send({
        from: fromEmail,
        to: founderEmail,
        replyTo: email,
        subject: `New message from ${email}`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
            <h1 style="font-size: 24px; margin-bottom: 8px;">Kimondo</h1>
            <p style="color: #757575; font-size: 14px; margin-bottom: 24px;">New message via founder form</p>
            <p style="font-size: 14px; color: #757575;">From: <strong style="color: #000;">${email}</strong></p>
            <div style="margin-top: 16px; padding: 16px; background: #f5f5f5; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</div>
          </div>
        `,
      });
    } else {
      console.log(`[Founder message] From: ${email} → ${founderEmail}\n${message}`);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
