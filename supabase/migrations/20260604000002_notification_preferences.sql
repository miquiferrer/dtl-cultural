-- ============================================================
-- Migration: notification_preferences (jsonb, replaces flat category array)
-- ============================================================
-- Stores per-category subcategory preferences.
-- Schema: { "music": [], "theatre": ["dance", "theatre_show"] }
-- An empty array for a category means "all subcategories".
-- The old notification_categories column is kept for reference but no longer used.

alter table public.app_users
  add column if not exists notification_preferences jsonb not null default '{}'::jsonb;

comment on column public.app_users.notification_preferences is
  'JSON object mapping EventCategory → EventSubcategory[]. Empty array = all subcategories for that category. E.g.: {"music":[],"theatre":["dance"]}.';
