import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// Server-only client — see the note in ../send-otp/route.ts. The anon key
// has no access to otp_codes, so verification cannot be driven from the
// browser against someone else's email.
function getSupabase() {
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { persistSession: false },
  });
}

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ error: "email and code required" }, { status: 400 });
    }

    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("otp_codes")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .eq("verified", false)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
    }

    if (new Date(data.expires_at) < new Date()) {
      return NextResponse.json({ error: "Code has expired — request a new one" }, { status: 400 });
    }

    // Mark as verified
    await supabase.from("otp_codes").update({ verified: true }).eq("id", data.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
