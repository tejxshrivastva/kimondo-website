import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOtpEmail, isResendLive } from "@/lib/resend";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.verificationToken.upsert({
      where: { identifier_token: { identifier: email, token: otp } },
      update: { expires },
      create: { identifier: email, token: otp, expires },
    });

    console.log(`\n=============================`);
    console.log(`[OTP] Email: ${email}`);
    console.log(`[OTP] Code: ${otp}`);
    console.log(`=============================\n`);

    sendOtpEmail(email, otp).catch((err) =>
      console.error("[Resend] OTP email failed:", err)
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
