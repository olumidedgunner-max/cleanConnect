import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
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
