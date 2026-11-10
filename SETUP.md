# Rebuild from scratch — CleanConnect / CTSCleaner

Written 2026-11-10, after the original Supabase project
(`xshemmkygkuaynyjbqrx`) was deleted following ~6 months idle on the free
tier. The code was never the problem: the build compiles clean and the
front end never went down. Only the data layer needs recreating.

**There is no backup of the old data.** The schema rebuilds, the rows do
not. The 7 sample cleaners are hardcoded in `src/lib/sampleCleaners.ts`,
so the site still looks populated.

---

## What only you can do (needs browser logins)

### 1. New Supabase project — ~5 min

1. https://supabase.com/dashboard → **New project**
2. Name `ctscleaner`, region **London (eu-west-2)** — closest to your users
3. Set a strong database password and save it into `credentials/`
4. **Choose the Pro plan ($25/mo).** On Free it auto-pauses after 7 days
   idle, which is exactly what killed the last one.

### 2. Create the schema — ~2 min

1. In the new project → **SQL Editor** → New query
2. Paste the whole of **`supabase-setup.sql`** → Run
3. Read the result grid at the bottom: **6 rows, all saying `OK`**

That one file replaces the old `supabase-schema.sql` +
`supabase-add-otp.sql` pair, creates the `room-photos` storage bucket,
and is safe to re-run.

### 3. Copy the two new keys — ~1 min

**Project Settings → API**, copy:

| Supabase field | Goes into |
|---|---|
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` |
| `anon` / `publishable` key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |

Do **not** use the `service_role` key — it bypasses RLS and these two
variables are `NEXT_PUBLIC_`, meaning they ship to the browser.

### 4. Log in to Vercel — ~1 min

```
vercel login
```

Use the account that owns `ctscleaner` (scope **`olumide-s-projects1`**).
Note: the Vercel account currently connected to Claude is
`daddyoba12@gmail.com`, which cannot see that project — so this has to be
you in a browser.

---

## What happens next (I can do all of this)

Paste me the Project URL and anon key and I will:

1. Fill `.env.local` and keep a filled backup in `credentials/`
2. Run `scripts/wire-env.ps1` to push all four variables to Vercel
   across production, preview and development
3. Redeploy production
4. Drive the real site with Playwright end to end — post a job, upload a
   room photo, confirm the AI analysis saves, request an OTP, verify it,
   register a cleaner — and confirm the rows actually land in Supabase
5. Commit the result

---

## Then, to actually trade

Two things still stand between "working demo" and "taking money".

### A domain + verified email sender

Today OTP emails send from `onboarding@resend.dev`, Resend's shared
sandbox sender. **It only delivers to your own Resend account address** —
every real signup gets nothing and silently fails verification.

1. Buy a domain (~£10/yr for a `.co.uk`)
2. Add it in Resend → **Domains** → add the DKIM/SPF records
3. Set `RESEND_FROM=CleanConnect <noreply@yourdomain.co.uk>`

The code already reads `RESEND_FROM` (`src/app/api/send-otp/route.ts`),
so this is an env change, not a code change.

### Payments — not built

There is no Stripe code in this project at all: no package, no checkout
route. The "Proceed to Payment →" button at
`src/app/cleaners/[id]/page.tsx:368` leads nowhere.

Meanwhile `terms/page.tsx`, `privacy/page.tsx` and `support/page.tsx` all
promise Stripe escrow, Stripe identity verification and 24-hour payout
release. **Until Stripe Connect is built, those pages make claims the
platform cannot honour** — so either build it or soften the copy.

Scope when you're ready: Stripe Connect Express onboarding for cleaners,
PaymentIntent with manual capture for escrow, a release endpoint on the
24-hour timer, and Stripe Identity for the 6-monthly KYC.

---

## Running costs

| Item | Cost | Note |
|---|---|---|
| Supabase Pro | $25/mo | Required — Free auto-pauses and will break again |
| Vercel Pro | $20/mo | Hobby is non-commercial-use only |
| Resend | £0 | Free tier: 3,000/mo, 100/day, 3 domains |
| Domain `.co.uk` | ~£10/yr | Also needed for Resend sending |
| OpenAI usage | ~$5–15/mo | Estimate: roughly 1–3p per room photo on gpt-4o-mini |

**≈ $45–60/month (~£36–48).**

Stripe later adds no monthly platform fee, but: 1.5% + 20p per UK card
transaction, $2/month per active connected cleaner account, 0.25% + 25¢
per payout, and $1.50 per Stripe Identity check (first 50 free). At 50
active cleaners that's ~$100/mo in Connect account fees alone.

---

## Known issues to revisit

- **RLS is wide open.** `supabase-setup.sql` grants public read and
  insert on `jobs`, `cleaners` and `businesses` because there is no user
  auth yet. Anyone reading the public JS bundle can read those tables,
  including customer emails and phone numbers. This is a GDPR exposure —
  tighten it when auth lands.
- **OTP codes are readable.** The `otp_codes` policies allow public
  select, so a code can be read by anyone who can guess the email. Move
  verification behind a server-only client (service_role) when convenient.
