-- ============================================================
-- Migration: Notification preferences for app users
-- ============================================================

-- Add notification preference columns to app_users
alter table public.app_users
  add column if not exists notification_categories text[]  not null default '{}',
  add column if not exists notify_by_email          boolean not null default false;

comment on column public.app_users.notification_categories is
  'Array of EventCategory values the user wants email alerts for.';
comment on column public.app_users.notify_by_email is
  'Whether the user has opted-in to receive email alerts for new events.';

-- Note: email alerts are triggered by the web API (/api/events/approve)
-- calling the send-event-alerts Edge Function directly, avoiding the need
-- for pg_net (which may not be enabled on all Supabase plans).

