/**
 * Admin sessions.
 *
 * The password is never stored, in code or in the database — only a
 * scrypt hash of it, in an environment variable. Changing the password
 * is therefore an env var change and a redeploy, with no code edit.
 *
 * The session itself is a signed token rather than a database row, so
 * proxy.ts can check it without a round trip. Signing uses Web Crypto
 * so the same helper works in the proxy runtime and in route handlers.
 */

export const ADMIN_COOKIE = "cm_admin";
const SESSION_HOURS = 12;

function secret(): string {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s) throw new Error("ADMIN_SESSION_SECRET is not configured");
  return s;
}

function toBase64Url(bytes: ArrayBuffer): string {
  const bin = String.fromCharCode(...new Uint8Array(bytes));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sign(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return toBase64Url(mac);
}

/** Token is `expiry.signature`; the signature covers the expiry. */
export async function createSessionToken(): Promise<string> {
  const expiry = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  const payload = String(expiry);
  return `${payload}.${await sign(payload)}`;
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expiry = Number(payload);
  if (!Number.isFinite(expiry) || expiry < Date.now()) return false;

  const expected = await sign(payload);
  // Length-independent comparison: a plain === can leak how much of the
  // signature matched through timing.
  if (expected.length !== signature.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return diff === 0;
}

export function sessionCookieOptions() {
  return {
    httpOnly: true, // JavaScript on the page can never read it
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_HOURS * 60 * 60,
  };
}
