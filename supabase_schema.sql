-- ═══════════════════════════════════════════════════════════════════════
-- HOPE PHOTO & VELO STUDIO — COMPLETE SUPABASE DATABASE SCHEMA
-- Run this in Supabase Dashboard -> SQL Editor (New Query) -> Click RUN
-- URL: https://supabase.com/dashboard/project/pogmsktnqutjuvjmdaay/sql/new
-- ═══════════════════════════════════════════════════════════════════════

-- 1. Master KV Store for fast, atomic, zero-lag serverless syncing
create table if not exists public.app_store (
  key text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- 2. Structured Chats Table (Telegram bot conversations)
create table if not exists public.chats (
  chat_id text primary key,
  first_name text,
  last_name text,
  username text,
  order_id text,
  last_message text,
  last_message_at timestamptz default now(),
  unread_count integer default 0,
  data jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- 3. Structured Messages Table (Chat history)
create table if not exists public.messages (
  id text primary key,
  chat_id text not null,
  order_id text,
  sender text not null, -- 'client' | 'admin' | 'system'
  sender_name text,
  text text not null,
  type text default 'text',
  data jsonb,
  created_at timestamptz default now()
);

-- 4. Structured Orders Table (All bookings & receipts)
create table if not exists public.orders (
  id text primary key,
  client_name text not null,
  phone text,
  event_date text,
  package_name text,
  category text default 'wedding',
  total_price numeric default 0,
  deposit_amount numeric default 0,
  status text default 'PENDING_VERIFICATION',
  payment_method text,
  payment_proof text,
  signature_data_url text,
  telegram_user_id text,
  telegram_chat_id text,
  notes text,
  raw_data jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5. Custom Client Agreements Table
create table if not exists public.custom_agreements (
  id text primary key,
  name text not null,
  package_title text,
  price numeric default 0,
  category text default 'studio',
  deliverables jsonb default '[]'::jsonb,
  clauses jsonb default '[]'::jsonb,
  payment_terms text,
  client_name text,
  client_chat_id text,
  status text default 'draft',
  signing_url text,
  raw_data jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 6. Signed Legal Agreements Archive
create table if not exists public.signed_agreements (
  id text primary key,
  order_id text,
  client_name text,
  package_name text,
  agreed_price numeric default 0,
  deposit_paid numeric default 0,
  signature_data text,
  signed_at timestamptz default now(),
  raw_data jsonb default '{}'::jsonb
);

-- ── ENABLE ROW LEVEL SECURITY & PUBLIC ACCESS POLICIES ────────────────
alter table public.app_store enable row level security;
alter table public.chats enable row level security;
alter table public.messages enable row level security;
alter table public.orders enable row level security;
alter table public.custom_agreements enable row level security;
alter table public.signed_agreements enable row level security;

-- Allow read and write for the studio portal and serverless bot functions
drop policy if exists "app_store_all" on public.app_store;
create policy "app_store_all" on public.app_store for all using (true) with check (true);

drop policy if exists "chats_all" on public.chats;
create policy "chats_all" on public.chats for all using (true) with check (true);

drop policy if exists "messages_all" on public.messages;
create policy "messages_all" on public.messages for all using (true) with check (true);

drop policy if exists "orders_all" on public.orders;
create policy "orders_all" on public.orders for all using (true) with check (true);

drop policy if exists "agreements_all" on public.custom_agreements;
create policy "agreements_all" on public.custom_agreements for all using (true) with check (true);

drop policy if exists "signed_all" on public.signed_agreements;
create policy "signed_all" on public.signed_agreements for all using (true) with check (true);
