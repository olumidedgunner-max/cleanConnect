import { NextRequest, NextResponse } from "next/server";
import {
  adminEmail,
  getAdminDb,
  hashPassword,
  hashResetCode,
  passwordProblem,
} from "@/lib/adminPassword";
import { ADMIN_COOKIE, createSessionToken, sessionCookieOptions } from "@/lib/adminAuth";

/** Checks the emailed code and sets the new password. */
export async function POST(req: NextRequest) {
  try {
    const { email, code, password } = await req.json();

    if (!email || !code || !password) {
      return NextResponse.json({ error: "Email, code and new password required" }, { status: 400 });
    }
    if (String(email).trim().toLowerCase() !== adminEmail().toLowerCase()) {
      return NextResponse.json({ error: "Invalid code." }, { status: 400 });
    }

    const problem = passwordProblem(String(password));
    if (problem) return NextResponse.json({ error: problem }, { status: 400 });

    const db = getAdminDb();
    const { data: admin } = await db
      .from("admin_users")
      .select("id, reset_code_hash, reset_expires_at")
      .eq("email", adminEmail())
      .single();

    if (!admin?.reset_code_hash || !admin.reset_expires_at) {
      return NextResponse.json({ error: "Invalid code." }, { status: 400 });
    }
    if (new Date(admin.reset_expires_at).getTime() < Date.now()) {
      return NextResponse.json({ error: "That code has expired. Request a new one." }, { status: 400 });
    }
    if (hashResetCode(String(code).trim()) !== admin.reset_code_hash) {
      return NextResponse.json({ error: "Invalid code." }, { status: 400 });
    }

    const { error } = await db
      .from("admin_users")
      .update({
        password_hash: await hashPassword(String(password)),
        // Burn the code so it cannot be replayed.
        reset_code_hash: null,
        reset_expires_at: null,
      })
      .eq("id", admin.id);

    if (error) {
      console.error("Password update failed:", error);
      return NextResponse.json({ error: "Could not set the new password." }, { status: 500 });
    }

    // Signed in straight away: having just proved control of the inbox
    // and set the password, another login form adds nothing.
    const res = NextResponse.json({ success: true });
    res.cookies.set(ADMIN_COOKIE, await createSessionToken(), sessionCookieOptions());
    return res;
  } catch (error) {
    console.error("Reset confirm error:", error);
    return NextResponse.json({ error: "Could not reset the password." }, { status: 500 });
  }
}
