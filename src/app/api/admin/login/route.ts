import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, createSessionToken, sessionCookieOptions } from "@/lib/adminAuth";
import { adminEmail, getAdminDb, passwordMatchesHash } from "@/lib/adminPassword";

// Deliberately slow on a wrong password: it makes guessing expensive
// and the delay is imperceptible for a real login.
const WRONG_PASSWORD_DELAY_MS = 600;

/**
 * The stored password wins when one exists, so a reset takes effect
 * immediately. ADMIN_PASSWORD_HASH stays as the fallback, which is what
 * gets you in before any reset has happened — and what still works if
 * the database is unreachable.
 */
async function passwordMatches(password: string): Promise<boolean> {
  try {
    const db = getAdminDb();
    const { data } = await db
      .from("admin_users")
      .select("id, password_hash")
      .eq("email", adminEmail())
      .maybeSingle();

    if (data?.password_hash) {
      const ok = await passwordMatchesHash(password, data.password_hash);
      if (ok) {
        await db
          .from("admin_users")
          .update({ last_login_at: new Date().toISOString() })
          .eq("id", data.id);
      }
      return ok;
    }
  } catch (error) {
    // Falls through to the environment password rather than locking
    // everyone out when the database is down.
    console.error("Admin lookup failed, using env fallback:", error);
  }

  return passwordMatchesHash(password, process.env.ADMIN_PASSWORD_HASH);
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.ADMIN_SESSION_SECRET) {
      return NextResponse.json({ error: "Admin access is not configured." }, { status: 503 });
    }

    const { password } = await req.json();
    if (typeof password !== "string" || !password) {
      return NextResponse.json({ error: "Password required" }, { status: 400 });
    }

    if (!(await passwordMatches(password))) {
      await new Promise((r) => setTimeout(r, WRONG_PASSWORD_DELAY_MS));
      // Never say whether it was the password or the configuration.
      return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
    }

    const res = NextResponse.json({ success: true });
    res.cookies.set(ADMIN_COOKIE, await createSessionToken(), sessionCookieOptions());
    return res;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ error: "Could not sign in." }, { status: 500 });
  }
}

/** Lets the login page tell whether admin access has been set up yet. */
export async function GET() {
  return NextResponse.json({
    configured: Boolean(process.env.ADMIN_SESSION_SECRET),
    resetEmail: adminEmail().replace(/^(.).*(@.*)$/, "$1***$2"),
  });
}
