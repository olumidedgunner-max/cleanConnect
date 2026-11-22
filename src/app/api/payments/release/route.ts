import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getStripe, paymentsEnabled, cleanerPayoutPence } from "@/lib/stripe";

function getSupabase() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { persistSession: false },
  });
}

/**
 * Releases held funds to the cleaner. This is the moment the customer's
 * approval turns into money moving, so every precondition is checked
 * against the database rather than trusted from the caller.
 */
export async function POST(req: NextRequest) {
  if (!paymentsEnabled()) {
    return NextResponse.json({ error: "Payments are not enabled yet." }, { status: 503 });
  }

  try {
    const { jobId } = await req.json();
    if (!jobId) {
      return NextResponse.json({ error: "jobId required" }, { status: 400 });
    }

    const supabase = getSupabase();
    const { data: job, error } = await supabase
      .from("jobs")
      .select("id, subtotal, payment_status, cleaner_id, stripe_payment_intent, stripe_transfer_id")
      .eq("id", jobId)
      .single();

    if (error || !job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }
    if (job.payment_status !== "held") {
      return NextResponse.json(
        { error: `Cannot release a job that is ${job.payment_status}.` },
        { status: 409 }
      );
    }
    if (job.stripe_transfer_id) {
      // Guards against a double-click paying the cleaner twice.
      return NextResponse.json({ error: "Already released." }, { status: 409 });
    }
    if (!job.cleaner_id) {
      return NextResponse.json({ error: "No cleaner assigned to this job." }, { status: 409 });
    }

    const { data: cleaner } = await supabase
      .from("cleaners")
      .select("id, stripe_account_id, payouts_enabled")
      .eq("id", job.cleaner_id)
      .single();

    if (!cleaner?.stripe_account_id || !cleaner.payouts_enabled) {
      return NextResponse.json(
        { error: "The cleaner has not finished payout setup yet." },
        { status: 409 }
      );
    }

    const transfer = await getStripe().transfers.create({
      amount: cleanerPayoutPence(Number(job.subtotal)),
      currency: "gbp",
      destination: cleaner.stripe_account_id,
      transfer_group: `job_${job.id}`,
      metadata: { jobId: String(job.id), cleanerId: String(cleaner.id) },
    });

    await supabase
      .from("jobs")
      .update({
        payment_status: "released",
        stripe_transfer_id: transfer.id,
        released_at: new Date().toISOString(),
        status: "completed",
      })
      .eq("id", job.id);

    return NextResponse.json({ success: true, transferId: transfer.id });
  } catch (error) {
    console.error("Release error:", error);
    return NextResponse.json(
      { error: "Could not release payment. Please contact support." },
      { status: 500 }
    );
  }
}
