-- ============================================================
-- Migration: Auto-create profile on user sign-up + post-limit enforcement
-- ============================================================

-- ─── Auto-create profile on auth.users insert ────────────────

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, organization_name, city_id)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'organization_name', ''),
    (new.raw_user_meta_data->>'city_id')::uuid
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── Enforce post limit on event insert ──────────────────────

create or replace function public.enforce_post_limit()
returns trigger language plpgsql security definer as $$
declare
  v_tier      subscription_tier;
  v_used      integer;
  v_limit     integer;
begin
  select subscription_tier, posts_used_this_month
  into v_tier, v_used
  from public.profiles
  where id = new.organizer_id;

  -- Map tier to limit
  v_limit := case v_tier
    when 'free'    then 1
    when 'basic'   then 10
    when 'premium' then 100
    else 1
  end;

  if v_used >= v_limit then
    raise exception 'POST_LIMIT_REACHED: Has alcanzado el límite de publicaciones de tu plan (%). Actualiza tu suscripción para publicar más.', v_limit
      using errcode = 'P0001';
  end if;

  -- Increment counter
  update public.profiles
  set posts_used_this_month = posts_used_this_month + 1
  where id = new.organizer_id;

  return new;
end;
$$;

create trigger check_post_limit
  before insert on public.events
  for each row execute function public.enforce_post_limit();

-- ─── Reset monthly post count (called by Stripe webhook) ─────
-- This function is invoked by the Stripe webhook Edge Function
-- when invoice.payment_succeeded fires.

create or replace function public.reset_monthly_posts(p_stripe_subscription_id text)
returns void language plpgsql security definer as $$
begin
  update public.profiles
  set posts_used_this_month = 0,
      subscription_period_start = now()
  where stripe_subscription_id = p_stripe_subscription_id;
end;
$$;

-- ─── Update subscription tier (called by Stripe webhook) ─────

create or replace function public.update_subscription(
  p_stripe_customer_id     text,
  p_stripe_subscription_id text,
  p_tier                   subscription_tier
)
returns void language plpgsql security definer as $$
begin
  update public.profiles
  set subscription_tier         = p_tier,
      stripe_subscription_id    = p_stripe_subscription_id,
      subscription_period_start = now(),
      posts_used_this_month     = 0
  where stripe_customer_id = p_stripe_customer_id;
end;
$$;

-- ─── Downgrade to free on subscription deletion ──────────────

create or replace function public.cancel_subscription(p_stripe_customer_id text)
returns void language plpgsql security definer as $$
begin
  update public.profiles
  set subscription_tier         = 'free',
      stripe_subscription_id    = null,
      subscription_period_start = null,
      posts_used_this_month     = 0
  where stripe_customer_id = p_stripe_customer_id;
end;
$$;

-- ─── Seed: default demo city ─────────────────────────────────

insert into public.cities (name, slug, config) values (
  'Demo City',
  'demo',
  '{"primaryColor": "#6366f1", "secondaryColor": "#a5b4fc", "appName": "Cultura Demo"}'
) on conflict (slug) do nothing;
