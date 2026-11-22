import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getStripe, paymentsEnabled, toPence, siteUrl } from "@/lib/stripe";

function getSupabase() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { persistSession: false },
  });
}

export async function POST(req: NextRequest) {
  if (!paymentsEnabled()) {
    return NextResponse.json(
      { error: "Card payments are not enabled yet." },
      { status: 503 }
    );
  }

  try {
    const { jobId } = await req.json();
    if (!jobId) {
      return NextResponse.json({ error: "jobId required" }, { status: 400 });
    }

    const supabase = getSupabase();
    const { data: job, error } = await supabase
      .from("jobs")
      .select("id, total, subtotal, email, payment_status, cleaner_id")
      .eq("id", jobId)
      .single();

    if (error || !job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }
    if (job.payment_status === "held" || job.payment_status === "released") {
      return NextResponse.json({ error: "This job is already paid." }, { status: 409 });
    }

    // The amount is read from the database, never from the request body:
    // a client that could name its own price could pay £1 for a £200 job.
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: job.email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "gbp",
            unit_amount: toPence(Number(job.total)),
            product_data: {
              name: "Cleaning job",
              description: "Held until you approve the completed work.",
            },
          },
        },
      ],
      // Funds land in the platform balance and stay there. The cleaner is
      // paid by a separate transfer once the customer approves.
      payment_intent_data: {
        metadata: { jobId: String(job.id) },
        description: `CleanersMarketplace job ${job.id}`,
      },
      metadata: { jobId: String(job.id) },
      success_url: `${siteUrl()}/jobs/${job.id}?paid=1`,
      cancel_url: `${siteUrl()}/jobs/${job.id}?cancelled=1`,
    });

    await supabase
      .from("jobs")
      .update({ stripe_session_id: session.id })
      .eq("id", job.id);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Could not start payment. Please try again." },
      { status: 500 }
    );
  }
}
