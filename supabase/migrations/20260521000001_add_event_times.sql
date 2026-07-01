-- ============================================================
-- Migration: Add start_time and end_time to events
-- ============================================================

alter table public.events
  add column start_time time,
  add column end_time   time;

-- end_time must be after start_time when both are set on the same day
alter table public.events
  add constraint end_time_after_start check (
    end_time is null or start_time is null or end_time >= start_time
  );

comment on column public.events.start_time is 'Optional start time for the event (HH:MM:SS).';
comment on column public.events.end_time   is 'Optional end time for the event (HH:MM:SS).';
