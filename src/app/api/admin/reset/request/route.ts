import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import {
  adminEmail,
  getAdminDb,
  generateResetCode,
  hashResetCode,
  RESET_WINDOW_MINUTES,
} from "@/lib/adminPassword";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM ?? "CleanersMarketplace <onboarding@resend.dev>";

/**
 * Sends a reset code to the admin address. Always answers the same way,
 * whatever was typed: telling a stranger whether an address is an admin
 * account is a free hint for whoever is trying to break in.
 */
export async function POST(req: NextRequest) {
  const sameAnswer = NextResponse.json({
    success: true,
    message: "If that address is registered, a reset code is on its way.",
  });

  try {
    const { email } = await req.json();
    if (typeof email !== "string" || !email) return sameAnswer;
    if (email.trim().toLowerCase() !== adminEmail().toLowerCase()) return sameAnswer;

    const code = generateResetCode();
    const expires = new Date(Date.now() + RESET_WINDOW_MINUTES * 60 * 1000);

    const db = getAdminDb();
    const { error } = await db
      .from("admin_users")
      .update({ reset_code_hash: hashResetCode(code), reset_expires_at: expires.toISOString() })
      .eq("email", adminEmail());

    if (error) {
      console.error("Reset code save failed:", error);
      return sameAnswer;
    }

    await resend.emails.send({
      from: FROM,
      to: adminEmail(),
      subject: `Admin password reset code — ${code}`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;">
          <div style="background:#07111f;padding:28px;border-radius:18px 18px 0 0;">
            <h1 style="margin:0;color:white;font-size:22px;font-weight:900;">Cleaners<span style="color:#bde8ff;">Marketplace</span></h1>
          </div>
          <div style="border:1px solid #e6ebf1;border-top:none;border-radius:0 0 18px 18px;padding:28px;">
            <p style="font-size:16px;color:#0d1727;margin:0 0 18px;">Your admin password reset code:</p>
            <p style="font-size:34px;font-weight:900;letter-spacing:6px;color:#0d1727;margin:0 0 18px;">${code}</p>
            <p style="font-size:14px;color:#6b7a8c;margin:0;">
              It expires in ${RESET_WINDOW_MINUTES} minutes. If you did not ask for this, ignore
              this email — your password has not changed.
            </p>
          </div>
        </div>`,
    });

    return sameAnswer;
  } catch (error) {
    console.error("Reset request error:", error);
    return sameAnswer;
  }
}
