-- Admin accounts. Run in the Supabase SQL editor; safe to re-run.
--
-- The admin password previously lived only in an environment variable,
-- so changing it meant a redeploy and there was no way to reset it.
-- Moving it here makes reset a normal flow, and allows more than one
-- admin later without a code change.
--
-- Only the scrypt hash is ever stored. The password itself is not,
-- anywhere.

create table if not exists admin_users (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  password_hash text,
  reset_code_hash text,
  reset_expires_at timestamptz,
  last_login_at timestamptz,
  created_at timestamptz default now()
);

alter table admin_users enable row level security;

-- No policies are created on purpose. With row-level security on and no
-- policy granting access, the public key can read and write nothing
-- here. Every admin route uses the service-role key server-side.

create index if not exists admin_users_email_idx on admin_users (lower(email));

-- The first admin. Password is left null: it falls back to
-- ADMIN_PASSWORD_HASH until a reset sets one here.
insert into admin_users (email)
values ('info@cleanersmarketplace.co.uk')
on conflict (email) do nothing;
