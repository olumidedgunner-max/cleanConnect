# Rebuild — CleanConnect / CTSCleaner

The original Supabase project (`xshemmkygkuaynyjbqrx`) was deleted after
~6 months idle on the free tier. The code was never the problem: the
build compiled clean and the front end never went down. Only the data
layer needed recreating.

**There was no backup of the old data.** The schema rebuilt, the rows did
not. The 7 sample cleaners are hardcoded in `src/lib/sampleCleaners.ts`,
so the site still looks populated.

---

## Status: rebuilt and verified, 2026-11-11

| Step | State |
|---|---|
| Supabase project | **Done** — provisioned via Vercel Marketplace as `supabase-chestnut-arrow` |
| Schema + bucket | **Done** — all 5 tables, RLS policies, `room-photos` bucket, 6/6 verified |
| Vercel env vars | **Done** — injected automatically across production, preview, development |
| Preview deploy | **Done** — built Ready in 30s |
| End-to-end test | **Done** — 24/24 checks (see below) |
| Production deploy | **Pending — needs you** (see next section) |

New project ref: `nmaiatqssemjqmkntmpr`. Billing runs through the Vercel
account `olumidedgunner-3629`, scope `olumide-s-projects1` — no separate
Supabase account or invoice.

### What the end-to-end test actually proved

Driven with Playwright against a dev server on the live new database,
using a real room photo (a frame extracted from `public/ladycleaningtable.mp4`):

- Post-a-Job wizard, all 5 steps, Individual path
- Photo → OpenAI `gpt-4o-mini` vision → analysis returned and rendered
- Photo stored in Supabase Storage and publicly readable (HTTP 200)
- `jobs` row written (£63 for one kitchen), `analyses` row written with image URL
- `send-otp` → 200, code row stored; `verify-otp` → 200 and row marked verified
- Wrong OTP code correctly rejected with 400
- All 7 pages render, zero console or page errors

All test data was deleted afterwards. All five tables and the storage
bucket are empty.

---

## The one step left: deploy production

Production is still serving the 173-day-old build that points at the dead
database. The deploy itself is blocked from automation, so run:

```
vercel --prod --yes
```

Then the live site at https://ctscleaner.vercel.app picks up the new
credentials. Nothing else is needed — the env vars are already in place.

---

## Then, to actually trade

Two things still stand between "working demo" and "taking money".

### A domain + verified email sender

Today OTP emails send from `onboarding@resend.dev`, Resend's shared
sandbox sender. **It only delivers to your own Resend account address** —
every real signup gets nothing and silently fails verification.

Confirmed directly against the Resend API on 2026-11-11. Sending to an
external address returns:

> 403 — "You can only send testing emails to your own email address
> (the Resend account owner). To send emails to other recipients, please
> verify a domain at resend.com/domains, and change the `from` address to
> an email using this domain."

So the OTP route is sound — it was tested green against Resend's test
address — but **no real customer or cleaner can complete verification
until a domain is verified.** This is the single biggest functional gap
now that the database is back.

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
