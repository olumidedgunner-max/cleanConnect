import { scrypt, timingSafeEqual, randomBytes, createHash } from "node:crypto";
import { promisify } from "node:util";
import { createClient } from "@supabase/supabase-js";

const scryptAsync = promisify(scrypt);

/** The address reset codes are sent to. */
export function adminEmail(): string {
  return process.env.ADMIN_EMAIL ?? "info@cleanersmarketplace.co.uk";
}

export function getAdminDb() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: { persistSession: false },
  });
}

/** Stored as `salt:hash`, both hex. */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

export async function passwordMatchesHash(password: string, stored: string | null | undefined) {
  if (!stored) return false;
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  const expected = Buffer.from(hash, "hex");
  if (expected.length !== derived.length) return false;
  return timingSafeEqual(derived, expected);
}

/**
 * Reset codes are stored hashed, like passwords. A readable code in the
 * database would let anyone with read access take over the account.
 */
export function hashResetCode(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}

export function generateResetCode(): string {
  return String(randomBytes(4).readUInt32BE(0) % 1000000).padStart(6, "0");
}

export const RESET_WINDOW_MINUTES = 15;

/**
 * Minimum the password must clear. Deliberately modest, but it rules
 * out the single-word and all-digit passwords that get guessed first.
 */
export function passwordProblem(password: string): string | null {
  if (password.length < 10) return "Use at least 10 characters.";
  if (!/[a-z]/i.test(password)) return "Include at least one letter.";
  if (!/[0-9]/.test(password)) return "Include at least one number.";
  return null;
}
