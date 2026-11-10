# CTSCleaner (CleanConnect)

A marketplace platform connecting customers with individual cleaners and cleaning companies. AI-powered room analysis determines fair pricing, with built-in negotiation, escrow payments, KYC verification, and email OTP validation.

**Live:** https://ctscleaner.vercel.app

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Database | Supabase (PostgreSQL) |
| Storage | Supabase Storage (room photos) |
| AI Vision | OpenAI gpt-4o-mini / gpt-4o |
| Email | Resend |
| Deployment | Vercel (project: ctscleaner) |

---

## User Journeys

There are two top-level paths on the platform:

### 1. Post a Job (Customer Side)
Anyone needing cleaning services — individual or business.

- **Individual** — posts for home/personal property. No VAT applied.
- **Business** — posts for commercial property. UK VAT (20%) auto-calculated. Business domain email required (no Gmail/Hotmail/Yahoo etc.).

### 2. Service Provider (Cleaner Side)
Anyone offering cleaning services — individual or company.

- **Individual Cleaner** — any email. One-off onboarding fee: £99 (non-refundable).
- **Cleaning Company** — business domain email required. One-off onboarding fee: £179 (non-refundable).

---

## Features

### Post a Job
- Step 1: Choose poster type — Individual or Business
- Step 2: Select number of rooms (Kitchen, Living Room, Bedroom, Play Room, Toilet/Bathroom)
- Step 3: Upload room photos — AI analyses each one (dirtiness, clutter, hours, price, risk)
- Step 4: Price summary with platform fee, optional content insurance, and VAT (business only)
- Step 5: Contact details — business email enforced for business accounts
- Funds held in escrow, released 24 hours after job completion — no automatic release

### AI Room Analysis
- Images compressed to 768px max width, JPEG 0.65 quality before upload
- Uploaded to Supabase Storage, then sent to OpenAI Vision
- Returns: room type, cleanliness score, clutter score, estimated hours, risk level, suggested price, recommended cleaners
- Model: `gpt-4o-mini` by default (cheap, fast)
- Auto-switches to `gpt-4o` when declared content value exceeds £10,000
- Model badge shown on each analysis result

### Service Provider Registration
- Email OTP verification via Resend (6-digit code, 10-minute expiry)
- Business companies must use a business domain email (validated on both card selection and email field)
- Pre-agree to auto-accept 90% price tier at registration
- KYC required every 6 months — business email NOT required for KYC

### Negotiation System (4-Price Tiers)
- When a customer selects a cleaner, they enter rooms and upload photos
- AI determines the base price
- Customer offered 4 tiers: 100%, 95%, 90% (default), 80%
- Email sent to cleaner to accept
- If cleaner pre-agreed to 90% → auto-accepted instantly, customer proceeds to payment

### UK VAT (Business Accounts)
- Standard rate: 20%
- Applied to: service subtotal + platform fee
- VAT receipt issued on payment
- VAT number field (optional) collected at job posting

### Content Insurance
- Optional add-on when posting a job
- 8% flat rate of declared content value
- Maximum cover: £4,000
- Premium capped at £320

### Pricing Model
| Component | Rate |
|---|---|
| Base hourly rate | £20/hr |
| Clean room (score 1–3) | Minimum 2 hours |
| Moderate dirt (score 4–6) | +50% hours |
| Heavy/Extreme dirt (score 7–10) | Minimum 4 hours |
| Platform fee (customer) | 5% |
| Matching fee (cleaner payout) | 7.5% |
| UK VAT (business accounts only) | 20% |

### Registration Fees (one-off, non-refundable)
| Type | Fee |
|---|---|
| Individual cleaner | £99 |
| Cleaning company | £179 |

---

## Navigation Structure

| Nav Item | Destination | Who uses it |
|---|---|---|
| Home | / | Everyone |
| Dashboard | /dashboard | Admin |
| Find Cleaners | /cleaners | Customers |
| Post a Job | /post-job | Individual & Business customers |
| Service Provider | /register-cleaner | Individual cleaners & companies |

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── analyze-room/     # OpenAI Vision room analysis
│   │   ├── send-otp/         # Resend email OTP (6-digit, 10min expiry)
│   │   └── verify-otp/       # OTP verification
│   ├── cleaners/
│   │   ├── page.tsx          # Browse all cleaners
│   │   └── [id]/page.tsx     # Cleaner profile + 4-price booking flow
│   ├── dashboard/page.tsx    # Admin overview
│   ├── jobs/[id]/page.tsx    # Job detail page
│   ├── post-job/page.tsx     # Post a cleaning job (individual or business)
│   ├── register-cleaner/     # Service Provider registration + OTP flow
│   ├── register-individual/  # Landing: post job or register as cleaner
│   ├── register-business/    # Landing: post job or register as company
│   ├── privacy/              # Privacy policy
│   ├── terms/                # Terms of service
│   └── support/              # Support page
├── components/
│   ├── PostJobSection.tsx    # Full job posting form with AI pricing + VAT
│   ├── RegisterBusinessSection.tsx
│   ├── FeeStructure.tsx
│   ├── HeroSection.tsx
│   ├── HowItWorks.tsx
│   ├── JobListings.tsx
│   ├── Navbar.tsx            # Post a Job + Service Provider
│   └── Footer.tsx
├── context/
│   └── CleanConnectContext.tsx  # Supabase CRUD (jobs, cleaners, businesses)
└── lib/
    ├── supabase.ts           # Supabase client
    ├── analysisLimit.ts      # Daily free analysis limit (5/day)
    ├── sampleCleaners.ts     # 7 placeholder cleaners (2 individual, 2 company, 3 service providers)
    └── sampleJobs.ts         # Sample jobs for demo
```

---

## Placeholder Data

### Individual Cleaners
| Name | City | Rate | Auto-Accept 90% |
|---|---|---|---|
| Sarah Mitchell | London (SE1) | £20/hr | Yes |
| James Okafor | London (E1) | £25/hr | No |

### Cleaning Companies
| Name | City | Rate | Auto-Accept 90% |
|---|---|---|---|
| Sparkle Pro Clean Ltd | Manchester | £30/hr | Yes |
| Clean & Shine Services Ltd | London | £28/hr | No |

### Service Providers
| Name | Type | City | Rate |
|---|---|---|---|
| PrimeServ Facilities Ltd | Business | Birmingham | £32/hr |
| Priya Sharma | Individual | Birmingham | £20/hr |
| Tom Bradley | Individual | Leeds | £20/hr |

---

## Database Schema (Supabase)

### `jobs`
| Column | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| rooms | jsonb | Room types and counts |
| total_rooms | int | Total rooms |
| subtotal | numeric | AI-calculated subtotal |
| total | numeric | Total inc. platform fee, VAT, insurance |
| email | text | Customer email |
| phone | text | Customer phone |
| postcode | text | Job postcode |
| city | text | Job city |
| status | text | awaiting / accepted / completed |
| conditions | jsonb | Per-room condition map |
| created_at | timestamptz | Timestamp |

### `cleaners`
| Column | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| name | text | Full name or company name |
| email | text | Contact email (business domain for companies) |
| phone | text | Contact phone |
| postcode / city | text | Location |
| bio | text | Description |
| type | text | individual / company |
| rate | numeric | Hourly rate (£) |
| radius | int | Coverage radius (miles) |
| company_number | text | Companies House number |
| auto_accept_90 | boolean | Pre-agreed 90% auto-accept |
| created_at | timestamptz | Timestamp |

### `businesses`
| Column | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| company_name | text | Registered company name |
| company_number | text | Companies House number |
| vat_number | text | VAT number (optional) |
| contact_name | text | Primary contact |
| email / phone | text | Business contact details |
| postcode / city | text | Location |
| service_type | text | Type of cleaning needed |
| created_at | timestamptz | Timestamp |

### `analyses`
| Column | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| job_id | uuid | FK → jobs |
| room_key / room_index | text / int | Which room |
| image_url | text | Supabase Storage public URL |
| room_type | text | Detected room type |
| cleanliness_score | int | 1–10 |
| clutter_score | int | 1–10 |
| estimated_cleaning_hours | numeric | AI estimate |
| risk_level | text | Low / Moderate / High / Extreme |
| suggested_price_gbp | numeric | AI price (£) |
| recommended_cleaners | int | Suggested cleaner count |
| reasoning | text | One-sentence AI summary |
| created_at | timestamptz | Timestamp |

### `otp_codes`
| Column | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| email | text | Target email address |
| code | text | 6-digit code |
| purpose | text | cleaner / customer |
| verified | boolean | Whether code was used |
| expires_at | timestamptz | 10-minute expiry |
| created_at | timestamptz | Timestamp |

---

## API Routes

### `POST /api/analyze-room`
Analyses a room image using OpenAI Vision and stores the result in Supabase.

**Body:**
```json
{
  "imageBase64": "...",
  "mediaType": "image/jpeg",
  "roomKey": "kitchen",
  "roomIndex": 0,
  "jobId": "uuid (optional)",
  "useHighAccuracy": false
}
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "room_type": "Kitchen",
    "cleanliness_score": 7,
    "clutter_score": 5,
    "estimated_cleaning_hours": 4,
    "risk_level": "High",
    "suggested_price_gbp": 80,
    "recommended_cleaners": 1,
    "reasoning": "Kitchen has grease buildup and dirty dishes."
  },
  "imageUrl": "https://..."
}
```

**Model selection:**
- `useHighAccuracy: false` → `gpt-4o-mini` (default)
- `useHighAccuracy: true` → `gpt-4o` (auto when content value > £10,000)

---

### `POST /api/send-otp`
Sends a 6-digit verification code via Resend.

**Body:** `{ "email": "user@example.com", "purpose": "cleaner" }`

---

### `POST /api/verify-otp`
Verifies a submitted OTP code.

**Body:** `{ "email": "user@example.com", "code": "123456" }`

---

## Environment Variables

| Variable | Used in | Description |
|---|---|---|
| `OPENAI_API_KEY` | Server | OpenAI Vision API |
| `NEXT_PUBLIC_SUPABASE_URL` | Client + Server | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client + Server | Supabase anon key |
| `RESEND_API_KEY` | Server | Resend transactional email |

All set in `.env.local` (local dev) and Vercel project `ctscleaner` (production).

---

## Local Setup

```bash
git clone <repo>
cd CleanConnect
npm install

# Create .env.local
OPENAI_API_KEY=sk-proj-...
NEXT_PUBLIC_SUPABASE_URL=https://xshemmkygkuaynyjbqrx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
RESEND_API_KEY=re_...

# Run Supabase schema (SQL Editor)
# paste supabase-schema.sql → run
# paste supabase-add-otp.sql → run (if otp_codes table missing)

npm run dev
```

---

## Deployment

```bash
vercel --prod --scope olumide-s-projects1 --yes
```

Live at: **https://ctscleaner.vercel.app**

---

## Business Rules Summary

| Rule | Detail |
|---|---|
| Individual cleaner fee | £99 one-off, non-refundable |
| Company cleaner fee | £179 one-off, non-refundable |
| KYC renewal | Every 6 months |
| Business email for KYC | NOT required |
| Business email to register as company | Required |
| Business email to post as business | Required |
| Escrow release | 24 hours after job completion |
| Auto-release | Never |
| Negotiation tiers | 100%, 95%, 90% (default), 80% |
| Auto-accept tier | 90% (if pre-agreed at registration) |
| Content insurance | 8% of declared value, max £4,000 |
| AI model (standard) | gpt-4o-mini |
| AI model (content > £10k) | gpt-4o |
| Image compression | 768px max, JPEG 0.65 quality |
| UK VAT (business jobs) | 20% on service + platform fee |
| Platform fee (customer) | 5% |
| Matching fee (cleaner) | 7.5% of payout |
