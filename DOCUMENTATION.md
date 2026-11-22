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
  (see section 7). GoDaddy's own DNS and email wizards cannot configure
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

## 4. The admin panel

**Sign in: https://cleanersmarketplace.co.uk/admin/login**

Everything under `/admin` and `/dashboard` is gated by `src/proxy.ts`,
which runs before a page renders, so a protected page never reaches a
browser without a valid session. Before this existed, `/dashboard` was
public and linked from the navbar on every page.

### How the login works

- The password is never stored anywhere, in code or in the database.
  Only a scrypt hash with a random salt is kept.
- A successful sign-in sets a signed token (HMAC-SHA256) in an httpOnly
  cookie lasting 12 hours. JavaScript on the page cannot read it.
- A wrong password takes a deliberate 600ms and never reveals whether
  the password or the configuration was at fault.
- Sign out: `POST /api/admin/logout`.

### Resetting the password

1. **Forgot password?** on the sign-in page, or go straight to
   `/admin/reset`
2. Enter the admin address. A 6-digit code is emailed to
   `info@cleanersmarketplace.co.uk` and is valid for 15 minutes
3. Enter the code and a new password (10+ characters, a letter and a
   number). You are signed in immediately afterwards

The reset page answers identically whatever address is typed, so it
never confirms which addresses are admin accounts. Codes are stored
hashed and are burned once used, so a code cannot be replayed.

Admin accounts live in the `admin_users` table. `ADMIN_PASSWORD_HASH`
remains a fallback: it is what gets you in before any reset has
happened, and what still works if the database is unreachable.

To change the fallback password:

```bash
node scripts/hash-password.js "the new password"
# put the output in ADMIN_PASSWORD_HASH in Vercel, then redeploy
```

### What the panel can do today

`/dashboard` lists every job, every registered cleaner and every
business, with locations, totals and status. It is a **read-only view**.

### What it cannot do yet

None of the following is built. Each needs customer and cleaner
accounts to exist first, which they do not:

- Approving or suspending users
- Seeing who is signed in (nobody signs in; there are no user accounts)
- Overriding a price the AI has set
- Holding a payment back from release
- Composing and sending an email to customers from the panel
- Blocking someone by email, phone or name
- KYC identity checks (would be Stripe Identity, with a per-check cost)

---

## 5. The code

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
  api/admin/*       admin login, logout, password reset
src/proxy.ts        gates /admin and /dashboard before anything renders
src/components/     UI building blocks
src/context/        MarketplaceContext: jobs, cleaners, businesses
src/lib/            stripe, supabase, contact address, analysis limit
public/sw.js        service worker (PWA offline support)
```

**Database tables:** `jobs`, `cleaners`, `businesses`, `analyses`,
`otp_codes`, plus the `room-photos` storage bucket. The schema is in
`supabase-schema.sql`; payment columns are in `supabase-stripe.sql`;
admin accounts are in `supabase-admin.sql`.

**Two rules worth keeping:**

1. **Prices are read from the database, never from the request body.** A
   client that can name its own price can pay £1 for a £200 job.
2. **Payment is recorded from the Stripe webhook, not the browser
   redirect.** A customer can close the tab before redirecting, and a
   redirect can be forged. A signed webhook cannot.

---

## 6. Environment variables

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
| `ADMIN_PASSWORD_HASH` | Fallback admin password, as `salt:hash` from `scripts/hash-password.js` |
| `ADMIN_SESSION_SECRET` | Signs admin session cookies |
| `ADMIN_EMAIL` | Where reset codes go. Defaults to `info@cleanersmarketplace.co.uk` |

Anything starting `NEXT_PUBLIC_` is visible to every visitor. Secrets
must never use that prefix.

---

## 7. Running and deploying

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

## 8. Turning payments on

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

## 9. Health check

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://cleanersmarketplace.co.uk/
curl -s https://cleanersmarketplace.co.uk/robots.txt
curl -s https://cleanersmarketplace.co.uk/api/payments/status
npx vercel integration list          # Supabase must read "Available"
npx vercel dns ls cleanersmarketplace.co.uk
```

---

## 10. Things that will waste a day if you do not know them

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

---

## 11. Pending

**Needs you**

1. **Run `supabase-admin.sql`** — creates the `admin_users` table. Until
   then password reset cannot work; sign-in still works on the
   environment fallback.
2. **Supabase Pro, $25/month** — the Free plan suspends after 7 days
   idle. The clock restarted on 22 Nov, so the next suspension is
   around **29 November**. This is what destroyed the May database.
3. **Stripe account + keys** — the payment layer is built and waiting.
   Set `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`, run the
   webhook setup in section 8, and it switches on.
4. **Google Search Console** — paste the verification TXT value and
   indexing can start. `robots.txt` and `sitemap.xml` are already live.
5. **Change the admin password.** The current one is weak and was shared
   in plain text during setup.

**Needs building**

6. **Customer and cleaner accounts.** Nobody can sign in; there is no
   account system. This blocks most of the admin panel: approving
   users, seeing who is online, blocking people, assisted password
   resets. A decision comes first — passwords, or sign-in by emailed
   code (which reuses the OTP system already in place and removes
   password storage entirely).
7. **The admin controls listed in section 4** — price override, payment
   holds, blocklist, email composer. Holds and releases only work once
   Stripe is connected.
8. **KYC** — Stripe Identity. Has a per-check cost.
9. **Escrow copy still overstates the product.** Terms, privacy and
   support describe escrow, KYC and 24-hour payouts as live. The
   payment layer exists but is switched off, and KYC does not exist at
   all. These become true at different times.

**Known limits**

- The payment layer has never run against Stripe. It builds and refuses
  cleanly while disabled, but no money has moved through it.
- `/dashboard` is read-only.
