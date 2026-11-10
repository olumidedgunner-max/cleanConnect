-- ============================================================
-- CleanConnect / CTSCleaner — complete Supabase setup
-- ============================================================
-- Run this ONCE in the SQL Editor of a brand-new Supabase project.
-- Safe to re-run: every statement is idempotent.
--
-- Replaces the older split files (supabase-schema.sql +
-- supabase-add-otp.sql), which are kept only for reference.
--
-- After running, scroll to the bottom — the final query prints a
-- checklist so you can confirm all 5 tables and the storage bucket
-- exist before wiring the app.
-- ============================================================


-- ------------------------------------------------------------
-- 1. Tables
-- ------------------------------------------------------------

create table if not exists jobs (
  id uuid default gen_random_uuid() primary key,
  rooms jsonb not null,
  total_rooms int not null,
  subtotal numeric not null,
  total numeric not null,
  email text not null,
  phone text not null,
  postcode text not null,
  city text not null,
  status text default 'awaiting' check (status in ('awaiting','accepted','completed')),
  conditions jsonb default '{}',
  created_at timestamptz default now()
);

create table if not exists cleaners (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  phone text not null,
  postcode text not null,
  city text not null,
  bio text default '',
  type text default 'individual' check (type in ('individual','company')),
  rate numeric default 25,
  radius int default 20,
  company_number text,
  auto_accept_90 boolean default false,
  created_at timestamptz default now()
);

create table if not exists businesses (
  id uuid default gen_random_uuid() primary key,
  company_name text not null,
  company_number text not null,
  vat_number text default '',
  contact_name text not null,
  email text not null,
  phone text not null,
  postcode text not null,
  city text not null,
  service_type text default '',
  created_at timestamptz default now()
);

create table if not exists analyses (
  id uuid default gen_random_uuid() primary key,
  job_id uuid references jobs(id) on delete cascade,
  room_key text,
  room_index int,
  image_url text,
  room_type text,
  cleanliness_score int,
  clutter_score int,
  estimated_cleaning_hours numeric,
  risk_level text,
  suggested_price_gbp numeric,
  recommended_cleaners int,
  reasoning text,
  created_at timestamptz default now()
);

create table if not exists otp_codes (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  code text not null,
  purpose text not null,
  verified boolean default false,
  expires_at timestamptz not null,
  created_at timestamptz default now()
);

-- Lookup index for the OTP verify path (email + code + verified)
create index if not exists otp_codes_email_code_idx
  on otp_codes (email, code) where verified = false;


-- ------------------------------------------------------------
-- 2. Row Level Security
-- ------------------------------------------------------------
-- NOTE: these policies are deliberately open, because the app has no
-- user authentication yet — the browser talks to Supabase with the
-- anon key. Anyone who reads the public JS bundle can read the jobs,
-- cleaners and businesses tables. Lock this down when auth is added.

alter table jobs       enable row level security;
alter table cleaners   enable row level security;
alter table businesses enable row level security;
alter table analyses   enable row level security;
alter table otp_codes  enable row level security;

drop policy if exists "public read jobs"   on jobs;
drop policy if exists "public insert jobs" on jobs;
create policy "public read jobs"   on jobs for select using (true);
create policy "public insert jobs" on jobs for insert with check (true);

drop policy if exists "public read cleaners"   on cleaners;
drop policy if exists "public insert cleaners" on cleaners;
create policy "public read cleaners"   on cleaners for select using (true);
create policy "public insert cleaners" on cleaners for insert with check (true);

drop policy if exists "public read businesses"   on businesses;
drop policy if exists "public insert businesses" on businesses;
create policy "public read businesses"   on businesses for select using (true);
create policy "public insert businesses" on businesses for insert with check (true);

drop policy if exists "public read analyses"   on analyses;
drop policy if exists "public insert analyses" on analyses;
create policy "public read analyses"   on analyses for select using (true);
create policy "public insert analyses" on analyses for insert with check (true);

-- OTP needs all four verbs: insert (new code), select (verify),
-- update (mark verified), delete (clear previous unused codes).
drop policy if exists "public insert otp" on otp_codes;
drop policy if exists "public read otp"   on otp_codes;
drop policy if exists "public update otp" on otp_codes;
drop policy if exists "public delete otp" on otp_codes;
create policy "public insert otp" on otp_codes for insert with check (true);
create policy "public read otp"   on otp_codes for select using (true);
create policy "public update otp" on otp_codes for update using (true);
create policy "public delete otp" on otp_codes for delete using (true);


-- ------------------------------------------------------------
-- 3. Storage — room photos
-- ------------------------------------------------------------
-- The bucket must be named exactly 'room-photos' and be public:
-- src/app/api/analyze-room/route.ts uploads here and then calls
-- getPublicUrl() to store a readable link on the analyses row.

insert into storage.buckets (id, name, public)
values ('room-photos', 'room-photos', true)
on conflict (id) do update set public = true;

drop policy if exists "public upload room photos" on storage.objects;
drop policy if exists "public read room photos"   on storage.objects;

create policy "public upload room photos" on storage.objects
  for insert with check (bucket_id = 'room-photos');

create policy "public read room photos" on storage.objects
  for select using (bucket_id = 'room-photos');


-- ------------------------------------------------------------
-- 4. Verification — read the output of this query
-- ------------------------------------------------------------
-- Expect 6 rows, every one saying OK.

select 'table: jobs'        as item, case when exists (select 1 from information_schema.tables where table_name = 'jobs')       then 'OK' else 'MISSING' end as status
union all
select 'table: cleaners',        case when exists (select 1 from information_schema.tables where table_name = 'cleaners')   then 'OK' else 'MISSING' end
union all
select 'table: businesses',      case when exists (select 1 from information_schema.tables where table_name = 'businesses') then 'OK' else 'MISSING' end
union all
select 'table: analyses',        case when exists (select 1 from information_schema.tables where table_name = 'analyses')   then 'OK' else 'MISSING' end
union all
select 'table: otp_codes',       case when exists (select 1 from information_schema.tables where table_name = 'otp_codes')  then 'OK' else 'MISSING' end
union all
select 'bucket: room-photos',    case when exists (select 1 from storage.buckets where id = 'room-photos' and public)      then 'OK' else 'MISSING' end
order by item;
