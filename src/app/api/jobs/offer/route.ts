import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";
import { siteUrl } from "@/lib/stripe";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM ?? "CleanersMarketplace <onboarding@resend.dev>";

function getSupabase() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { persistSession: false },
  });
}

/**
 * Emails a cleaner that a customer has offered them a job. The booking
 * page claimed this was happening long before anything sent it.
 */
export async function POST(req: NextRequest) {
  try {
    const { jobId, cleanerId, amount } = await req.json();
    if (!jobId || !cleanerId) {
      return NextResponse.json({ error: "jobId and cleanerId required" }, { status: 400 });
    }

    const supabase = getSupabase();
    const { data: cleaner } = await supabase
      .from("cleaners")
      .select("name, email")
      .eq("id", cleanerId)
      .single();

    if (!cleaner?.email) {
      return NextResponse.json({ error: "Cleaner not found" }, { status: 404 });
    }

    const jobUrl = `${siteUrl()}/jobs/${jobId}`;
    const offer = typeof amount === "number" ? `£${amount.toFixed(2)}` : "a new job";

    const { error } = await resend.emails.send({
      from: FROM,
      to: cleaner.email,
      subject: `New cleaning job offer — ${offer}`,
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;">
          <div style="background:#07111f;padding:28px;border-radius:18px 18px 0 0;">
            <h1 style="margin:0;color:white;font-size:24px;font-weight:900;">Cleaners<span style="color:#bde8ff;">Marketplace</span></h1>
          </div>
          <div style="border:1px solid #e6ebf1;border-top:none;border-radius:0 0 18px 18px;padding:28px;">
            <p style="font-size:16px;color:#0d1727;margin:0 0 16px;">Hi ${cleaner.name},</p>
            <p style="font-size:16px;color:#0d1727;margin:0 0 16px;">
              A customer has offered you a cleaning job worth <strong>${offer}</strong>.
            </p>
            <p style="margin:0 0 24px;">
              <a href="${jobUrl}" style="display:inline-block;background:#1ea7ff;color:white;text-decoration:none;padding:14px 26px;border-radius:12px;font-weight:700;">View the job</a>
            </p>
            <p style="font-size:13px;color:#6b7a8c;margin:0;">
              Jobs are offered to several cleaners, so reply promptly if you want it.
            </p>
          </div>
        </div>`,
    });

    if (error) {
      console.error("Offer email failed:", error);
      return NextResponse.json({ error: "Could not notify the cleaner." }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Offer error:", error);
    return NextResponse.json({ error: "Could not notify the cleaner." }, { status: 500 });
  }
}
