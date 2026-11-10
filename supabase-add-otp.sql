-- Run this in Supabase SQL Editor to add OTP verification table
-- Safe to run even if other tables already exist

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

do $$ begin
  create policy "public insert otp" on otp_codes for insert with check (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "public read otp" on otp_codes for select using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "public update otp" on otp_codes for update using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "public delete otp" on otp_codes for delete using (true);
exception when duplicate_object then null; end $$;
