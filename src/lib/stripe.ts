import Stripe from "stripe";

// Fee model, matching what the pages already show the user:
//   customer pays  = subtotal + 5% platform fee
//   cleaner receives = subtotal - 7.5% matching fee
// The platform keeps both halves.
export const PLATFORM_FEE_RATE = 0.05;
export const MATCHING_FEE_RATE = 0.075;

/**
 * Payments stay switched off until a secret key exists. Every route
 * checks this rather than throwing, so the site says "not yet
 * available" instead of failing with a stack trace.
 */
export function paymentsEnabled(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");
  return new Stripe(key);
}

/** Stripe works in the smallest currency unit, so pounds become pence. */
export function toPence(pounds: number): number {
  return Math.round(pounds * 100);
}

/** What the cleaner is owed once the matching fee is taken off. */
export function cleanerPayoutPence(subtotal: number): number {
  return toPence(subtotal * (1 - MATCHING_FEE_RATE));
}

export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://cleanersmarketplace.co.uk";
}
