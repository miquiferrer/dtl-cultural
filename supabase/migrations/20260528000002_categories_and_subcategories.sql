-- ============================================================
-- Migration: expand event_category enum + add subcategory column
-- ============================================================

-- 1. Add new enum values to event_category
alter type event_category add value if not exists 'festivals';
alter type event_category add value if not exists 'family';
alter type event_category add value if not exists 'cinema';
alter type event_category add value if not exists 'art';
alter type event_category add value if not exists 'workshops';
alter type event_category add value if not exists 'networking';
alter type event_category add value if not exists 'sports';
alter type event_category add value if not exists 'nightlife';
alter type event_category add value if not exists 'traditions';
alter type event_category add value if not exists 'solidarity';
alter type event_category add value if not exists 'university';
alter type event_category add value if not exists 'tech';
alter type event_category add value if not exists 'wellness';

-- 2. Create subcategory enum
do $$ begin
  if not exists (select 1 from pg_type where typname = 'event_subcategory') then
    create type event_subcategory as enum (
      -- music
      'concerts','dj_electronic','jazz','rock','indie','classical',
      'flamenco','urban_music','festivals_music','jam_sessions',
      -- theatre
      'theatre_show','monologues','improv','musicals','circus','dance','performance',
      -- festivals
      'local_fairs','markets','food_trucks','cultural_festivals','medieval_fairs','themed_events',
      -- food
      'tastings','brunch','food_events','tapas','wine','craft_beer','food_popups',
      -- family
      'kids_workshops','storytelling','family_activities','kids_shows','parties',
      -- cinema
      'cinema_show','documentaries','short_films','film_forum','screenings',
      -- art
      'exhibitions','museums','photography','urban_art','galleries','openings',
      -- workshops
      'ceramics','painting','writing','cooking','photo_workshop','creativity','languages',
      -- networking
      'networking_event','entrepreneurship','startups','talks','conferences','meetups',
      -- sports
      'running','yoga','hiking','fitness','tournaments','outdoor',
      -- nightlife
      'clubs','sessions','afterworks','karaoke','open_format',
      -- traditions
      'festa_major','castellers','sardanes','correfoc','diades','catalan_culture',
      -- solidarity
      'ngo','volunteering','charity_events','local_community',
      -- university
      'upc_events','university_life','associations','youth_events',
      -- tech
      'gaming','ai','technology','esports','lan_parties',
      -- wellness
      'meditation','yoga_wellness','mindfulness','wellness','therapies'
    );
  end if;
end $$;

-- 3. Add subcategory column to events (nullable for backwards compat)
alter table public.events
  add column if not exists subcategory event_subcategory null;
