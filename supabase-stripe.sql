-- Payment columns. Run in the Supabase SQL editor; safe to re-run.
--
-- Money model: the customer's card is charged in full to the platform
-- account, which holds the funds. Nothing reaches the cleaner until the
-- customer approves the finished job, at which point the cleaner's share
-- is transferred to their connected account. That hold is what the site
-- calls escrow.

alter table jobs
  add column if not exists cleaner_id uuid references cleaners(id),
  add column if not exists payment_status text
    check (payment_status in ('unpaid', 'held', 'released', 'refunded'))
    default 'unpaid',
  add column if not exists stripe_session_id text,
  add column if not exists stripe_payment_intent text,
  add column if not exists stripe_transfer_id text,
  add column if not exists amount_paid numeric,
  add column if not exists paid_at timestamptz,
  add column if not exists released_at timestamptz;

alter table cleaners
  add column if not exists stripe_account_id text,
  add column if not exists payouts_enabled boolean default false;

create index if not exists jobs_payment_intent_idx on jobs (stripe_payment_intent);
create index if not exists jobs_cleaner_idx on jobs (cleaner_id);

-- Payment columns are written only by the server (service_role) and by
-- Stripe webhooks. The public key must never be able to mark a job paid.
revoke update on jobs from anon;
