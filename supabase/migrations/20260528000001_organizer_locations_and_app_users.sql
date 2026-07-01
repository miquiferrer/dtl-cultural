-- ============================================================
-- Migration: organizer_locations, app_users, updated trigger
-- ============================================================

-- ─── organizer_locations ─────────────────────────────────────
-- Replaces the single default_location_* columns on profiles with a
-- proper 1:N table so organizers can store multiple venue addresses.

create table public.organizer_locations (
  id            uuid primary key default gen_random_uuid(),
  organizer_id  uuid not null references public.profiles(id) on delete cascade,
  label         text not null,
  location_text text not null,
  latitude      double precision not null,
  longitude     double precision not null,
  created_at    timestamptz not null default now()
);

comment on table public.organizer_locations is 'Saved venue addresses for each organizer/customer.';

-- Migrate any existing single-location data from profiles
insert into public.organizer_locations (organizer_id, label, location_text, latitude, longitude)
select id, 'Local principal', default_location_text, default_latitude, default_longitude
from public.profiles
where default_location_text is not null
  and default_latitude is not null
  and default_longitude is not null;

alter table public.organizer_locations enable row level security;

create policy "organizer_locations_self"
  on public.organizer_locations for all
  using (organizer_id = auth.uid() or public.is_admin())
  with check (organizer_id = auth.uid());

create index organizer_locations_organizer on public.organizer_locations (organizer_id);

-- ─── app_users ────────────────────────────────────────────────
-- Separate table for mobile-app end-users (those browsing events),
-- distinct from organizers/admins who are in public.profiles.

create table public.app_users (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text not null,
  display_name text,
  created_at   timestamptz not null default now()
);

comment on table public.app_users is 'End-users of the mobile app (event browsers), distinct from organizers.';

alter table public.app_users enable row level security;

create policy "app_users_self_read"
  on public.app_users for select
  using (id = auth.uid());

create policy "app_users_self_update"
  on public.app_users for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- ─── Updated handle_new_user trigger ─────────────────────────
-- Routes new auth users to either app_users (mobile) or profiles (organizer)
-- based on the user_type field in user_metadata.
-- Organizers are always assigned to Terrassa (the only city).

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
declare
  v_city_id uuid;
begin
  if new.raw_user_meta_data->>'user_type' = 'app_user' then
    insert into public.app_users (id, email, display_name)
    values (
      new.id,
      new.email,
      coalesce(nullif(new.raw_user_meta_data->>'display_name', ''), null)
    );
  else
    -- Organizer / admin: always assign Terrassa as the city
    select id into v_city_id from public.cities where slug = 'terrassa' limit 1;
    insert into public.profiles (id, email, organization_name, city_id)
    values (
      new.id,
      new.email,
      coalesce(new.raw_user_meta_data->>'organization_name', ''),
      v_city_id
    );
  end if;
  return new;
end;
$$;
