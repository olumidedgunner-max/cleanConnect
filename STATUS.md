# Project status — 21 November 2026

Where the project stands at the end of the session, what is proven to
work, and what is still open. Written so the next session can start
without re-discovering any of it.

## What this is

**CleanersMarketplace** — a two-sided cleaning marketplace. Customers
post a job and the AI prices it from room photos; cleaners find work.
Based in Nottingham.

- Brand name: **CleanersMarketplace** (CleanConnect is retired — do not
  reintroduce it)
- Strapline: **YOUR CLEAN CONNECTIONS**
- Tagline: **Find Work. Find Cleaners. Connect.**

## Addresses

| What | Where |
|---|---|
| Live site | https://cleanersmarketplace.co.uk (and `www`) |
| Vercel project | `cleanersmarketplace` (renamed from `ctscleaner`) |
| Old fallback URL | `ctscleaner.vercel.app` — still live on purpose |
| Repo | `github.com/olumidedgunner-max/cleanConnect`, branch `master` |
| Local folder | `Desktop\Projects\CleanersMarketplace` |

The repo name was deliberately left as `cleanConnect`: it is not
public-facing. Account logins and keys are in `credentials/ACCESS.md`,
which is gitignored and never committed.

## Verified working

Each of these was tested against production, not assumed.

- **Domain** — delegated to Vercel nameservers at the registry 08:01 UTC
  on 21 Nov. Let's Encrypt certificate covering apex and `www`, graded
  A+ by SSL Labs.
- **Database** — Supabase restored from suspension. Schema and the
  `room-photos` bucket intact, API keys unchanged, all tables at 0 rows.
- **Email sending** — Resend domain verified (eu-west-1). A real OTP was
  sent to a non-owner address: HTTP 200, row written, test row deleted.
  Sender is `CleanersMarketplace <noreply@cleanersmarketplace.co.uk>`.
- **AI pricing** — a test room photo through `/api/analyze-room` in
  production returned a full analysis and priced it at £80 for 4 hours,
  which matches the documented formula. Test row and image deleted.
- **Indexing prerequisites** — `robots.txt` and `sitemap.xml` are live
  (both were 404 before) and carry the real domain.

## Open items

1. **Escrow is promised but does not exist.** The terms, privacy and
   support pages, the footer and both detail pages describe escrow, KYC
   and 24-hour payouts. There is no `stripe` package, no checkout route
   and the payment button does nothing. Signup and AI pricing both work
   now, so a real customer can reach that dead button. Either build
   Stripe Connect or soften the copy — the copy edit is the smaller job
   and should come first.
2. **Supabase is on the Free plan and pauses after 7 days idle.** It
   suspended around 19 Nov and was restored on the 21st. The clock
   restarted, so the next deadline is roughly **28 November**. Prolonged
   suspension is what destroyed the May 2026 database. Pro is $25/mo.
3. **`info@cleanersmarketplace.co.uk` is unconfirmed.** MX records point
   at GoDaddy Professional Email (`smtp.secureserver.net`,
   `mailstore1.secureserver.net`) and a test email was sent, but nobody
   has confirmed it arrived. If it did not, the mailbox is Microsoft 365
   and the MX needs swapping for the tenant host. The privacy policy
   names this address as the GDPR contact point.
4. **Google indexing has not started.** It needs a Search Console
   property, which needs a verification record from the user's Google
   account. Paste the `TXT` value and it can be published immediately.
   Separately, local map results need a Google Business Profile — the
   structured data alone will not produce them.
5. **Homepage stat tiles are honest but thin.** The invented figures
   (4.9 rating, £2M+ escrow, 24/7 monitoring) were removed. The
   replacements are true but modest; revisit once there is real volume.

## Things that will waste your time if you do not know them

- **DNS lives at Vercel, not GoDaddy.** GoDaddy is registrar only. Add
  records with `vercel dns add <domain> <name> <type> <value>`; its own
  email and DNS wizards cannot configure this zone.
- **This machine's network intercepts port 53.** Queries aimed at a
  named server return the local resolver's cached answer, so
  `nslookup <host> <server>` lies. Use DNS-over-HTTPS
  (`https://dns.google/resolve?name=...`) and, for registry truth,
  `https://rdap.nominet.uk/uk/domain/<domain>`. Direct connections to
  Vercel edge IPs are blocked, so TLS cannot be tested locally — SSL
  Labs' API works.
- **Vercel's domain check caches old nameservers for hours** and will
  not issue a certificate while it does. `vercel certs issue <apex>
  <www>` bypasses it.
- **Resend will always show "partially verified".** Its receiving MX is
  deliberately absent because the apex MX belongs to the mailbox
  provider. Sending is fully verified. Do not "restart verification".
- **The service worker caches pages.** It is now network-first for
  navigations, but if copy changes appear not to deploy, suspect
  `public/sw.js` before the build.
- **An empty OpenAI balance kills pricing site-wide.** The key keeps
  authenticating and listing models; the only symptom is
  `429 credit_balance_exhausted`. Auto-recharge prevents it.
- **Test data must be cleaned up.** Tests write to `otp_codes`,
  `analyses` and the `room-photos` bucket. Delete with the service-role
  key; the public key has no delete grant.

## Quick health check

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://cleanersmarketplace.co.uk/
curl -s https://cleanersmarketplace.co.uk/robots.txt
npx vercel integration list          # Supabase must read "Available"
npx vercel dns ls cleanersmarketplace.co.uk
```
