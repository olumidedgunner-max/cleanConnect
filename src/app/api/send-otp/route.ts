import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

// onboarding@resend.dev is Resend's shared sandbox sender — it only
// delivers to your own Resend account address. Set RESEND_FROM to a
// verified domain sender before real users sign up.
const FROM = process.env.RESEND_FROM ?? "CleanConnect <onboarding@resend.dev>";

// Server-only client. otp_codes grants the anon key no access at all —
// otherwise anyone could read a verification code out of the browser and
// complete signup as someone else. service_role bypasses RLS and must
// never be exposed to the client.
function getSupabase() {
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { persistSession: false },
  });
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const { email, purpose } = await req.json();

    if (!email || !purpose) {
      return NextResponse.json({ error: "email and purpose required" }, { status: 400 });
    }

    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const supabase = getSupabase();

    // Remove any existing unused OTP for this email
    await supabase.from("otp_codes").delete().eq("email", email).eq("verified", false);

    // Save new OTP
    const { error: dbError } = await supabase.from("otp_codes").insert({
      email,
      code,
      purpose,
      expires_at: expiresAt.toISOString(),
      verified: false,
    });

    if (dbError) {
      return NextResponse.json({ error: "Failed to save OTP" }, { status: 500 });
    }

    const purposeLabel = purpose === "cleaner" ? "Cleaner Registration" : purpose === "customer" ? "Job Posting" : "Verification";

    const { error: emailError } = await resend.emails.send({
      from: FROM,
      to: email,
      subject: `Your CleanConnect verification code — ${code}`,
      html: `
        <!DOCTYPE html>
        <html>
          <body style="margin:0;padding:0;background:#07111f;font-family:'Segoe UI',Arial,sans-serif;">
            <div style="max-width:520px;margin:40px auto;background:linear-gradient(180deg,#0d1727,#101d30);border-radius:20px;border:1px solid rgba(255,255,255,.08);overflow:hidden;">
              <div style="background:linear-gradient(135deg,#1ea7ff,#0077ff);padding:28px 36px;">
                <h1 style="margin:0;color:white;font-size:24px;font-weight:900;">Clean<span style="color:#bde8ff;">Connect</span></h1>
                <p style="margin:6px 0 0;color:rgba(255,255,255,.8);font-size:14px;">${purposeLabel}</p>
              </div>
              <div style="padding:36px;">
                <p style="color:#c5d0dc;font-size:15px;line-height:1.7;margin:0 0 28px;">
                  Here is your one-time verification code. It expires in <strong style="color:white;">10 minutes</strong>.
                </p>
                <div style="background:rgba(87,199,255,.08);border:1px solid rgba(87,199,255,.25);border-radius:14px;padding:24px;text-align:center;margin-bottom:28px;">
                  <div style="font-size:42px;font-weight:900;letter-spacing:10px;color:#57c7ff;">${code}</div>
                </div>
                <p style="color:#9fb0c1;font-size:13px;line-height:1.6;margin:0;">
                  If you did not request this, you can safely ignore this email. Do not share this code with anyone.
                </p>
              </div>
              <div style="padding:20px 36px;border-top:1px solid rgba(255,255,255,.06);">
                <p style="margin:0;color:#9fb0c1;font-size:12px;">© 2026 CleanConnect · Secure marketplace for cleaning services</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (emailError) {
      // Don't leave an unusable code behind — it would block the next
      // send for this address (which deletes only unverified rows) and
      // sit in the table until it expired.
      await supabase.from("otp_codes").delete().eq("email", email).eq("code", code);
      console.error("Resend send failed:", emailError);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
