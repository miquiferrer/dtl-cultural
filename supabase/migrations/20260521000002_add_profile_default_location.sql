-- ============================================================
-- Migration: Add default venue location to organizer profiles
-- ============================================================

alter table public.profiles
  add column default_location_text text,
  add column default_latitude      double precision,
  add column default_longitude     double precision;

comment on column public.profiles.default_location_text is 'Optional default venue address for pre-filling the event form.';
comment on column public.profiles.default_latitude      is 'Latitude of the default venue.';
comment on column public.profiles.default_longitude     is 'Longitude of the default venue.';

-- Update the sign-up trigger so new accounts carry the location through
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (
    id, email, organization_name, city_id,
    default_location_text, default_latitude, default_longitude
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'organization_name', ''),
    (new.raw_user_meta_data->>'city_id')::uuid,
    nullif(trim(coalesce(new.raw_user_meta_data->>'default_location_text', '')), ''),
    case
      when (new.raw_user_meta_data->>'default_latitude') is not null
        and (new.raw_user_meta_data->>'default_latitude') != ''
      then (new.raw_user_meta_data->>'default_latitude')::double precision
      else null
    end,
    case
      when (new.raw_user_meta_data->>'default_longitude') is not null
        and (new.raw_user_meta_data->>'default_longitude') != ''
      then (new.raw_user_meta_data->>'default_longitude')::double precision
      else null
    end
  );
  return new;
end;
$$;
