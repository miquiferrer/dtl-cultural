-- Seed initial cities
insert into public.cities (name, slug) values
  ('Terrassa',  'terrassa'),
  ('Sabadell',  'sabadell'),
  ('Barcelona', 'barcelona')
on conflict (slug) do nothing;
