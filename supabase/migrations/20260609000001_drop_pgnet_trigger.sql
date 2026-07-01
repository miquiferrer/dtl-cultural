-- Drop the pg_net-based trigger and function added in 20260604000001.
-- Email alerts are now triggered by the web API route (/api/events/approve)
-- calling the send-event-alerts Edge Function directly.

drop trigger if exists on_event_approved on public.events;
drop function if exists public.notify_on_event_approved();
