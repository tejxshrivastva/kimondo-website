import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, email } = await req.json();
    if (!message || !email) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }
    // In production, send via Resend. For now, log.
    console.log(`[Founder message] From: ${email}\n${message}`);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
