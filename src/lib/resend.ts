import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "Kimondo <noreply@kimondo.in>";

export const isResendLive = !!RESEND_API_KEY;

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

export async function sendOtpEmail(to: string, otp: string) {
  if (!resend) {
    console.log(`[Resend Stub] OTP to ${to}: ${otp}`);
    return;
  }

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `${otp} is your Kimondo login code`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="font-size: 24px; margin-bottom: 8px;">Kimondo</h1>
        <p style="color: #757575; font-size: 14px; margin-bottom: 32px;">Your login code</p>
        <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 24px 0;">${otp}</p>
        <p style="color: #757575; font-size: 13px;">This code expires in 10 minutes. If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
}

export async function sendOrderConfirmation(
  to: string,
  orderNumber: string,
  totalFormatted: string,
  itemCount: number
) {
  if (!resend) {
    console.log(`[Resend Stub] Order confirmation to ${to}: ${orderNumber}`);
    return;
  }

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Order confirmed - ${orderNumber}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="font-size: 24px; margin-bottom: 8px;">Kimondo</h1>
        <p style="color: #757575; font-size: 14px; margin-bottom: 32px;">Order confirmation</p>
        <p style="font-size: 16px; margin-bottom: 8px;">Thank you for your order.</p>
        <p style="font-size: 14px; color: #757575;">Order number: <strong style="color: #000;">${orderNumber}</strong></p>
        <p style="font-size: 14px; color: #757575;">${itemCount} ${itemCount === 1 ? "item" : "items"} - ${totalFormatted}</p>
        <p style="font-size: 13px; color: #757575; margin-top: 32px;">You can view your order details in your profile.</p>
      </div>
    `,
  });
}

export async function sendShippedEmail(
  to: string,
  orderNumber: string,
  trackingUrl: string | null
) {
  if (!resend) {
    console.log(`[Resend Stub] Shipped email to ${to}: ${orderNumber}`);
    return;
  }

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Your order ${orderNumber} has shipped`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="font-size: 24px; margin-bottom: 8px;">Kimondo</h1>
        <p style="color: #757575; font-size: 14px; margin-bottom: 32px;">Shipping update</p>
        <p style="font-size: 16px; margin-bottom: 8px;">Your order <strong>${orderNumber}</strong> is on its way.</p>
        ${trackingUrl ? `<p style="font-size: 14px;"><a href="${trackingUrl}" style="color: #000; font-weight: bold;">Track your order →</a></p>` : ""}
      </div>
    `,
  });
}
