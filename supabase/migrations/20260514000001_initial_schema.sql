-- ============================================================
-- Migration: Initial schema
-- ============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ─── Enums ───────────────────────────────────────────────────

create type event_category as enum ('music', 'theatre', 'food', 'other');
create type event_status as enum ('pending', 'approved', 'rejected');
create type subscription_tier as enum ('free', 'basic', 'premium');
create type user_role as enum ('organizer', 'admin');

-- ─── Cities ──────────────────────────────────────────────────

create table public.cities (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  slug        text not null unique,
  config      jsonb not null default '{}',
  created_at  timestamptz not null default now()
);

comment on table public.cities is 'One row per city that has a mobile app build.';
comment on column public.cities.config is 'JSON: { primaryColor, secondaryColor, appName, logoUrl? }';

-- ─── Profiles ────────────────────────────────────────────────
-- Extends auth.users (1:1 relationship, same UUID)

create table public.profiles (
  id                        uuid primary key references auth.users(id) on delete cascade,
  email                     text not null,
  organization_name         text not null,
  city_id                   uuid not null references public.cities(id),
  subscription_tier         subscription_tier not null default 'free',
  posts_used_this_month     integer not null default 0 check (posts_used_this_month >= 0),
  subscription_period_start timestamptz,
  stripe_customer_id        text unique,
  stripe_subscription_id    text unique,
  role                      user_role not null default 'organizer',
  created_at                timestamptz not null default now()
);

comment on table public.profiles is 'Organizer / admin accounts, mirrors auth.users.';

-- ─── Events ──────────────────────────────────────────────────

create table public.events (
  id               uuid primary key default uuid_generate_v4(),
  city_id          uuid not null references public.cities(id),
  organizer_id     uuid not null references public.profiles(id) on delete cascade,
  title            text not null,
  description      text not null,
  category         event_category not null,
  start_date       date not null,
  end_date         date,
  price            numeric(10, 2),   -- null = free or TBD
  location_text    text not null,
  latitude         double precision not null,
  longitude        double precision not null,
  poster_url       text,
  website          text,
  status           event_status not null default 'pending',
  rejection_reason text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),

  constraint end_after_start check (end_date is null or end_date >= start_date)
);

comment on table public.events is 'Cultural events submitted by organizers.';
comment on column public.events.price is 'NULL means free or price not specified.';

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger events_set_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

-- ─── Push tokens ─────────────────────────────────────────────

create table public.push_tokens (
  id           uuid primary key default uuid_generate_v4(),
  device_token text not null unique,
  city_slug    text not null,
  created_at   timestamptz not null default now()
);

comment on table public.push_tokens is 'Expo push tokens for anonymous app users, scoped by city.';

-- ─── Indexes ─────────────────────────────────────────────────

create index events_city_status_start on public.events (city_id, status, start_date);
create index events_organizer on public.events (organizer_id);
create index push_tokens_city on public.push_tokens (city_slug);
