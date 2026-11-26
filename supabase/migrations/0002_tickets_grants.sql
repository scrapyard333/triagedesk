-- TriageDesk: allow signed-in users to use the tickets table.
-- Row Level Security (0001) still limits every user to their own rows.
-- The anon role (signed-out visitors) deliberately gets no access.
-- Safe to run more than once.

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.tickets to authenticated;
revoke all on public.tickets from anon;
