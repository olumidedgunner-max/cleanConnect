-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/xshemmkygkuaynyjbqrx/sql

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

-- Enable Row Level Security (open for now — lock down when auth is added)
alter table jobs enable row level security;
alter table cleaners enable row level security;
alter table businesses enable row level security;
alter table analyses enable row level security;

create policy "public read jobs" on jobs for select using (true);
create policy "public insert jobs" on jobs for insert with check (true);

create policy "public read cleaners" on cleaners for select using (true);
create policy "public insert cleaners" on cleaners for insert with check (true);

create policy "public read businesses" on businesses for select using (true);
create policy "public insert businesses" on businesses for insert with check (true);

create policy "public read analyses" on analyses for select using (true);
create policy "public insert analyses" on analyses for insert with check (true);

create table if not exists otp_codes (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  code text not null,
  purpose text not null,
  verified boolean default false,
  expires_at timestamptz not null,
  created_at timestamptz default now()
);

alter table otp_codes enable row level security;
create policy "public insert otp" on otp_codes for insert with check (true);
create policy "public read otp" on otp_codes for select using (true);
create policy "public update otp" on otp_codes for update using (true);
create policy "public delete otp" on otp_codes for delete using (true);

-- Storage bucket for room photos (run separately in Storage section or via SQL)
insert into storage.buckets (id, name, public)
values ('room-photos', 'room-photos', true)
on conflict (id) do nothing;

create policy "public upload room photos" on storage.objects
  for insert with check (bucket_id = 'room-photos');

create policy "public read room photos" on storage.objects
  for select using (bucket_id = 'room-photos');
