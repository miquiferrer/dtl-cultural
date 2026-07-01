-- ============================================================
-- Migration: Row Level Security policies
-- ============================================================

-- ─── Helper: check if current user is admin ──────────────────

create or replace function public.is_admin()
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ─── Cities ──────────────────────────────────────────────────

alter table public.cities enable row level security;

-- Everyone can read cities (needed by mobile app without auth)
create policy "cities_public_read"
  on public.cities for select
  using (true);

-- Only admins can insert/update/delete
create policy "cities_admin_write"
  on public.cities for all
  using (public.is_admin())
  with check (public.is_admin());

-- ─── Profiles ────────────────────────────────────────────────

alter table public.profiles enable row level security;

-- Organizer can only read and update their own profile
create policy "profiles_self_read"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

create policy "profiles_self_update"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- Profile is created by a trigger (see next migration), not directly by users
create policy "profiles_admin_all"
  on public.profiles for all
  using (public.is_admin())
  with check (public.is_admin());

-- ─── Events ──────────────────────────────────────────────────

alter table public.events enable row level security;

-- Public (mobile app): read only approved events with start_date >= today
create policy "events_public_read"
  on public.events for select
  using (
    status = 'approved'
    and start_date >= current_date
  );

-- Organizers read their own events (any status)
create policy "events_organizer_read_own"
  on public.events for select
  using (organizer_id = auth.uid());

-- Organizers can insert events into their own city
create policy "events_organizer_insert"
  on public.events for insert
  with check (
    organizer_id = auth.uid()
    and city_id = (select city_id from public.profiles where id = auth.uid())
  );

-- Organizers can update/delete only their own PENDING events
create policy "events_organizer_update_pending"
  on public.events for update
  using (organizer_id = auth.uid() and status = 'pending')
  with check (organizer_id = auth.uid() and status = 'pending');

create policy "events_organizer_delete_pending"
  on public.events for delete
  using (organizer_id = auth.uid() and status = 'pending');

-- Admins can do everything
create policy "events_admin_all"
  on public.events for all
  using (public.is_admin())
  with check (public.is_admin());

-- ─── Push tokens ─────────────────────────────────────────────

alter table public.push_tokens enable row level security;

-- Anonymous mobile app users can insert tokens (no auth required)
create policy "push_tokens_insert"
  on public.push_tokens for insert
  with check (true);

-- Nobody reads tokens from the client; only Edge Functions (service role) do
create policy "push_tokens_admin_read"
  on public.push_tokens for select
  using (public.is_admin());
