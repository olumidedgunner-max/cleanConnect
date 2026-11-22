# CleanersMarketplace — system documentation

How the product works, where every account lives, and how to run,
deploy and verify it. Current as of 22 November 2026.

---

## 1. What it is

A two-sided cleaning marketplace based in **Nottingham**. Customers post
a job, photograph their rooms and the AI prices the work; cleaners find
jobs and get paid once the customer approves.

- Name: **CleanersMarketplace** (CleanConnect is retired)
- Strapline: **YOUR CLEAN CONNECTIONS**
- Tagline: **Find Work. Find Cleaners. Connect.**
- Live: https://cleanersmarketplace.co.uk

---

## 2. Where everything is kept

**All services are owned by one account: Olumide's Gmail address.** One
login recovers everything — and losing it loses everything, so
two-factor authentication on that Gmail matters more than anything else
in this document.

Usernames, keys and passwords are **not** in this file. They live in
`credentials/ACCESS.md`, which is gitignored and never committed. This
file says *where* things are; that file says *how to get in*.

| Service | What it does | Where to reach it |
|---|---|---|
| **Vercel** | Hosting, builds, env vars, DNS | vercel.com → scope `olumide-s-projects1` → project `cleanersmarketplace` |
| **Supabase** | Database + photo storage | **No direct login.** Provisioned through the Vercel Marketplace: Vercel → Storage → `supabase-chestnut-arrow` → Open in Supabase |
| **GitHub** | Code, and the only backup of it | github.com/olumidedgunner-max/**cleanConnect** (repo keeps the old name deliberately) |
| **OpenAI** | Room photo analysis | platform.openai.com → org `cleaners-marketplace`, project `proj_vZQBbdOrOoj9cy3hU4dkPOkI` |
| **Resend** | Outgoing email (codes, job offers) | resend.com → Domains → `cleanersmarketplace.co.uk` |
| **GoDaddy** | Domain registrar **and** the `info@` mailbox | godaddy.com → Domains, and Email & Office |
| **Stripe** | Payments (not connected yet) | dashboard.stripe.com |

Two things that regularly confuse people:

- **Supabase has no separate login.** It is billed and accessed through
  Vercel. Looking for a supabase.com password wastes an afternoon.
- **GoDaddy no longer controls DNS.** It is registrar only; the
  nameservers point at Vercel, so records are added with the Vercel CLI
  (see section 6). GoDaddy's own DNS and email wizards cannot configure
  this domain.

---

## 3. How a job flows

```
customer posts job ──► AI prices each room from photos ──► job row created
        │                                                        │
        │                                             cleaner emailed the offer
        │                                                        │
        │                                             cleaner accepts: the job
        │                                             gets a cleaner_id and
        │                                             status "accepted"
        ▼                                                        │
customer pays ──► money held in the platform balance ◄───────────┘
        │
customer approves the finished job
        │
        ▼
cleaner's share transferred to their Stripe account
```

**Pricing.** The AI returns a room type, a 1–10 dirtiness score and
estimated hours. Price is `hours × £20`, rounded to the nearest £5.
Fees: the customer pays the job price **plus 5%**; the cleaner receives
the job price **minus 7.5%**. The platform keeps both.

**Why the money is held.** The customer's card is charged in full to the
platform balance and stays there. Nothing reaches the cleaner until the
customer approves. This is "separate charges and transfers" in Stripe's
terms, and that hold is what the site calls escrow.

---

## 4. The code

Next.js 16 (App Router), React 19, TypeScript, deployed on Vercel.

```
src/app/            pages and API routes
  api/analyze-room  OpenAI vision: room type, dirtiness, hours, price
  api/send-otp      email verification codes
  api/verify-otp    checks a code
  api/jobs/offer    emails a cleaner that they have an offer
  api/jobs/accept   records acceptance, attaches the cleaner to the job
  api/payments/*    checkout, webhook, release, status
  api/connect/*     Stripe onboarding for cleaners
src/components/     UI building blocks
src/context/        MarketplaceContext: jobs, cleaners, businesses
src/lib/            stripe, supabase, contact address, analysis limit
public/sw.js        service worker (PWA offline support)
```

**Database tables:** `jobs`, `cleaners`, `businesses`, `analyses`,
`otp_codes`, plus the `room-photos` storage bucket. The schema is in
`supabase-schema.sql`; payment columns are in `supabase-stripe.sql`.

**Two rules worth keeping:**

1. **Prices are read from the database, never from the request body.** A
   client that can name its own price can pay £1 for a £200 job.
2. **Payment is recorded from the Stripe webhook, not the browser
   redirect.** A customer can close the tab before redirecting, and a
   redirect can be forged. A signed webhook cannot.

---

## 5. Environment variables

Set in Vercel for production, preview and development; mirrored locally
in `.env.local`.

| Variable | For |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser database access |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only. Bypasses row-level security — never expose it |
| `POSTGRES_URL_NON_POOLING` | Direct SQL, for migrations |
| `OPENAI_API_KEY` | Room analysis |
| `RESEND_API_KEY`, `RESEND_FROM` | Outgoing email |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | Payments. **Not set yet** — payments stay off until they are |

Anything starting `NEXT_PUBLIC_` is visible to every visitor. Secrets
must never use that prefix.

---

## 6. Running and deploying

```bash
npm install
npx vercel env pull .env.local     # fetch current environment
npm run dev                        # http://localhost:3000

npx next build                     # always build before deploying
npx vercel --prod --yes            # deploy to production
git push origin master             # the only backup of the code
```

**DNS** (the zone lives at Vercel, not GoDaddy):

```bash
npx vercel dns ls cleanersmarketplace.co.uk
npx vercel dns add cleanersmarketplace.co.uk <name> <type> <value>
```

**Database migrations:** paste the `.sql` file into the Supabase SQL
editor (Vercel → Storage → `supabase-chestnut-arrow` → Open in Supabase
→ SQL Editor). The files are written to be safe to run twice.

---

## 7. Turning payments on

1. Create the Stripe account and enable **Connect**
2. Run `supabase-stripe.sql` (adds the payment columns)
3. Add a webhook endpoint at
   `https://cleanersmarketplace.co.uk/api/payments/webhook` for
   `checkout.session.completed`, `charge.refunded`, `account.updated`
4. Set `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` in Vercel, then
   redeploy
5. Check `curl https://cleanersmarketplace.co.uk/api/payments/status` —
   it should report `{"enabled":true}`
6. Test with Stripe test cards before taking real money

Until step 4, the pay button states plainly that card payments are not
live. Nothing pretends to work.

---

## 8. Health check

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://cleanersmarketplace.co.uk/
curl -s https://cleanersmarketplace.co.uk/robots.txt
curl -s https://cleanersmarketplace.co.uk/api/payments/status
npx vercel integration list          # Supabase must read "Available"
npx vercel dns ls cleanersmarketplace.co.uk
```

---

## 9. Things that will waste a day if you do not know them

- **Supabase Free pauses after 7 days idle.** It has happened twice. The
  first time the database was deleted and the data was lost. Pro is
  $25/month and is the only real fix.
- **An empty OpenAI balance kills pricing site-wide.** The key keeps
  working and listing models; the only symptom is
  `429 credit_balance_exhausted`. Turn on auto-recharge.
- **Resend will always show "partially verified".** Its receiving MX is
  deliberately absent, because inbound mail belongs to the GoDaddy
  mailbox. Sending is fully verified. Do not restart verification.
- **This machine's network intercepts DNS.** Queries aimed at a named
  server come back with the local resolver's cached answer, so
  `nslookup host server` lies. Use
  `https://dns.google/resolve?name=...`, and
  `https://rdap.nominet.uk/uk/domain/<domain>` for registry truth.
- **Vercel's domain check caches old nameservers for hours** and will
  not issue a certificate meanwhile. `vercel certs issue <apex> <www>`
  bypasses it.
- **The service worker caches pages.** It is network-first for pages
  now, but if a copy change seems not to deploy, suspect `public/sw.js`
  before the build.
- **Test data must be cleaned up.** Tests write to `otp_codes`,
  `analyses` and `room-photos`. Delete with the service-role key; the
  public key has no delete permission.
