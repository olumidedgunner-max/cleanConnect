import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { persistSession: false },
  });
}

/**
 * A cleaner accepting a job. This runs on the server because the public
 * key has no UPDATE grant on jobs — otherwise anyone could assign
 * themselves to a job and collect its payout.
 */
export async function POST(req: NextRequest) {
  try {
    const { jobId, cleaner } = await req.json();

    if (!jobId || !cleaner?.email || !cleaner?.name) {
      return NextResponse.json(
        { error: "jobId and cleaner name/email required" },
        { status: 400 }
      );
    }

    const supabase = getSupabase();

    const { data: job } = await supabase
      .from("jobs")
      .select("id, status, cleaner_id")
      .eq("id", jobId)
      .single();

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }
    if (job.cleaner_id) {
      return NextResponse.json(
        { error: "This job has already been accepted." },
        { status: 409 }
      );
    }

    // Returning cleaners keep their existing record — and their Stripe
    // account id with it, so they do not re-onboard for every job.
    const { data: existing } = await supabase
      .from("cleaners")
      .select("id")
      .eq("email", cleaner.email)
      .maybeSingle();

    let cleanerId = existing?.id;

    if (!cleanerId) {
      const { data: created, error: createError } = await supabase
        .from("cleaners")
        .insert({
          name: cleaner.name,
          email: cleaner.email,
          phone: cleaner.phone ?? "",
          postcode: cleaner.postcode ?? "",
          city: cleaner.city ?? "",
        })
        .select("id")
        .single();

      if (createError || !created) {
        console.error("Cleaner create failed:", createError);
        return NextResponse.json({ error: "Could not save your details." }, { status: 500 });
      }
      cleanerId = created.id;
    }

    const { error: updateError } = await supabase
      .from("jobs")
      .update({ cleaner_id: cleanerId, status: "accepted" })
      .eq("id", jobId)
      .is("cleaner_id", null); // loses a race rather than overwriting

    if (updateError) {
      console.error("Job accept failed:", updateError);
      return NextResponse.json({ error: "Could not accept the job." }, { status: 500 });
    }

    return NextResponse.json({ success: true, cleanerId });
  } catch (error) {
    console.error("Accept error:", error);
    return NextResponse.json({ error: "Could not accept the job." }, { status: 500 });
  }
}
