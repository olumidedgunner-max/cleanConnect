import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getStripe, paymentsEnabled } from "@/lib/stripe";

function getSupabase() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { persistSession: false },
  });
}

/**
 * Stripe tells us a payment succeeded here, not the browser. A customer
 * can close the tab before the success redirect, and a redirect can be
 * forged; a signed webhook cannot.
 */
export async function POST(req: NextRequest) {
  if (!paymentsEnabled()) {
    return NextResponse.json({ error: "Payments not enabled" }, { status: 503 });
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("STRIPE_WEBHOOK_SECRET is not configured");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  // The raw body is required: any reserialisation breaks the signature.
  const body = await req.text();

  let event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, secret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    const supabase = getSupabase();

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const jobId = session.metadata?.jobId;

      if (jobId && session.payment_status === "paid") {
        await supabase
          .from("jobs")
          .update({
            payment_status: "held",
            stripe_payment_intent:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : session.payment_intent?.id ?? null,
            amount_paid: (session.amount_total ?? 0) / 100,
            paid_at: new Date().toISOString(),
          })
          .eq("id", jobId);
      }
    }

    if (event.type === "charge.refunded") {
      const charge = event.data.object;
      const intentId =
        typeof charge.payment_intent === "string"
          ? charge.payment_intent
          : charge.payment_intent?.id;
      if (intentId) {
        await supabase
          .from("jobs")
          .update({ payment_status: "refunded" })
          .eq("stripe_payment_intent", intentId);
      }
    }

    if (event.type === "account.updated") {
      const account = event.data.object;
      await supabase
        .from("cleaners")
        .update({ payouts_enabled: Boolean(account.payouts_enabled) })
        .eq("stripe_account_id", account.id);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    // A 500 makes Stripe retry, which is what we want if the database
    // was briefly unreachable.
    console.error("Webhook handling error:", event.type, error);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }
}
