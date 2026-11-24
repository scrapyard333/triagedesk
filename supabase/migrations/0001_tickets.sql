-- TriageDesk: tickets table with Row Level Security.
-- Safe to run more than once.

create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid()
    references auth.users (id) on delete cascade,
  customer_name text not null
    check (char_length(customer_name) between 1 and 120),
  customer_email text not null
    check (char_length(customer_email) between 3 and 254),
  subject text not null
    check (char_length(subject) between 1 and 200),
  body text not null
    check (char_length(body) between 1 and 8000),
  status text not null default 'open'
    check (status in ('open', 'in_progress', 'resolved')),
  category text
    check (category in ('billing', 'bug', 'feature_request', 'account', 'how_to', 'other')),
  urgency text
    check (urgency in ('low', 'medium', 'high', 'critical')),
  sentiment text
    check (sentiment in ('positive', 'neutral', 'negative')),
  summary text,
  suggested_reply text,
  ai_confidence numeric(4, 3)
    check (ai_confidence between 0 and 1),
  triaged_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tickets_user_created_idx
  on public.tickets (user_id, created_at desc);
create index if not exists tickets_user_status_idx
  on public.tickets (user_id, status);

-- Keep updated_at fresh on every change.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tickets_set_updated_at on public.tickets;
create trigger tickets_set_updated_at
  before update on public.tickets
  for each row execute function public.set_updated_at();

-- Row Level Security: each signed-in user sees only their own tickets.
alter table public.tickets enable row level security;
revoke all on public.tickets from anon;

drop policy if exists "tickets_select_own" on public.tickets;
create policy "tickets_select_own" on public.tickets
  for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "tickets_insert_own" on public.tickets;
create policy "tickets_insert_own" on public.tickets
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "tickets_update_own" on public.tickets;
create policy "tickets_update_own" on public.tickets
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "tickets_delete_own" on public.tickets;
create policy "tickets_delete_own" on public.tickets
  for delete to authenticated
  using ((select auth.uid()) = user_id);
