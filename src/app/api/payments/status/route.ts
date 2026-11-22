import { NextResponse } from "next/server";
import { paymentsEnabled } from "@/lib/stripe";

/** Lets the client show "coming soon" instead of a button that fails. */
export async function GET() {
  return NextResponse.json({ enabled: paymentsEnabled() });
}
