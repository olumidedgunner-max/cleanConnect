import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getStripe, paymentsEnabled, siteUrl } from "@/lib/stripe";

function getSupabase() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { persistSession: false },
  });
}

/**
 * Starts (or resumes) Stripe Connect onboarding for a cleaner. Stripe
 * collects the identity and bank details and carries the compliance
 * burden; we only ever store the resulting account id.
 */
export async function POST(req: NextRequest) {
  if (!paymentsEnabled()) {
    return NextResponse.json({ error: "Payouts are not enabled yet." }, { status: 503 });
  }

  try {
    const { cleanerId } = await req.json();
    if (!cleanerId) {
      return NextResponse.json({ error: "cleanerId required" }, { status: 400 });
    }

    const supabase = getSupabase();
    const { data: cleaner, error } = await supabase
      .from("cleaners")
      .select("id, email, stripe_account_id")
      .eq("id", cleanerId)
      .single();

    if (error || !cleaner) {
      return NextResponse.json({ error: "Cleaner not found" }, { status: 404 });
    }

    const stripe = getStripe();
    let accountId = cleaner.stripe_account_id;

    if (!accountId) {
      const account = await stripe.accounts.create({
        type: "express",
        country: "GB",
        email: cleaner.email,
        capabilities: { transfers: { requested: true } },
        business_type: "individual",
        metadata: { cleanerId: String(cleaner.id) },
      });
      accountId = account.id;
      await supabase
        .from("cleaners")
        .update({ stripe_account_id: accountId })
        .eq("id", cleaner.id);
    }

    const link = await stripe.accountLinks.create({
      account: accountId,
      type: "account_onboarding",
      refresh_url: `${siteUrl()}/dashboard?payout=retry`,
      return_url: `${siteUrl()}/dashboard?payout=done`,
    });

    return NextResponse.json({ url: link.url });
  } catch (error) {
    console.error("Connect onboarding error:", error);
    return NextResponse.json(
      { error: "Could not start payout setup. Please try again." },
      { status: 500 }
    );
  }
}
