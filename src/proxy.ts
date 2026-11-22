import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/adminAuth";

/**
 * Gate for admin-only pages. Runs before anything renders, so a
 * protected page never reaches the browser without a valid session.
 *
 * /dashboard is included because it lists every job, cleaner and
 * business with their locations. It was publicly reachable and linked
 * from the navbar.
 */
const PROTECTED = ["/dashboard", "/admin"];
const PUBLIC_ADMIN = ["/admin/login", "/admin/reset"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_ADMIN.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }
  if (!PROTECTED.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next();
  }

  const valid = await verifySessionToken(req.cookies.get(ADMIN_COOKIE)?.value);
  if (valid) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
