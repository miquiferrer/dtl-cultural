// ─── Enums ───────────────────────────────────────────────────────────────────

export type EventCategory =
  | 'music'
  | 'theatre'
  | 'festivals'
  | 'food'
  | 'family'
  | 'cinema'
  | 'art'
  | 'workshops'
  | 'networking'
  | 'sports'
  | 'nightlife'
  | 'traditions'
  | 'solidarity'
  | 'university'
  | 'tech'
  | 'wellness'

export type EventSubcategory =
  // music
  | 'concerts' | 'dj_electronic' | 'jazz' | 'rock' | 'indie' | 'classical'
  | 'flamenco' | 'urban_music' | 'festivals_music' | 'jam_sessions'
  // theatre
  | 'theatre_show' | 'monologues' | 'improv' | 'musicals' | 'circus' | 'dance' | 'performance'
  // festivals
  | 'local_fairs' | 'markets' | 'food_trucks' | 'cultural_festivals' | 'medieval_fairs' | 'themed_events'
  // food
  | 'tastings' | 'brunch' | 'food_events' | 'tapas' | 'wine' | 'craft_beer' | 'food_popups'
  // family
  | 'kids_workshops' | 'storytelling' | 'family_activities' | 'kids_shows' | 'parties'
  // cinema
  | 'cinema_show' | 'documentaries' | 'short_films' | 'film_forum' | 'screenings'
  // art
  | 'exhibitions' | 'museums' | 'photography' | 'urban_art' | 'galleries' | 'openings'
  // workshops
  | 'ceramics' | 'painting' | 'writing' | 'cooking' | 'photo_workshop' | 'creativity' | 'languages'
  // networking
  | 'networking_event' | 'entrepreneurship' | 'startups' | 'talks' | 'conferences' | 'meetups'
  // sports
  | 'running' | 'yoga' | 'hiking' | 'fitness' | 'tournaments' | 'outdoor'
  // nightlife
  | 'parties' | 'clubs' | 'sessions' | 'afterworks' | 'karaoke' | 'open_format'
  // traditions
  | 'festa_major' | 'castellers' | 'sardanes' | 'correfoc' | 'diades' | 'catalan_culture'
  // solidarity
  | 'ngo' | 'volunteering' | 'charity_events' | 'local_community'
  // university
  | 'upc_events' | 'university_life' | 'associations' | 'youth_events'
  // tech
  | 'gaming' | 'ai' | 'technology' | 'esports' | 'lan_parties'
  // wellness
  | 'meditation' | 'yoga_wellness' | 'mindfulness' | 'wellness' | 'therapies'

export const CATEGORY_SUBCATEGORIES: Record<EventCategory, { value: EventSubcategory; label: string }[]> = {
  music: [
    { value: 'concerts', label: 'Conciertos' },
    { value: 'dj_electronic', label: 'DJ / Electrónica' },
    { value: 'jazz', label: 'Jazz' },
    { value: 'rock', label: 'Rock' },
    { value: 'indie', label: 'Indie' },
    { value: 'classical', label: 'Clásica' },
    { value: 'flamenco', label: 'Flamenco' },
    { value: 'urban_music', label: 'Música urbana' },
    { value: 'festivals_music', label: 'Festivales' },
    { value: 'jam_sessions', label: 'Jam sessions' },
  ],
  theatre: [
    { value: 'theatre_show', label: 'Teatro' },
    { value: 'monologues', label: 'Monólogos' },
    { value: 'improv', label: 'Improvisación' },
    { value: 'musicals', label: 'Musicales' },
    { value: 'circus', label: 'Circo' },
    { value: 'dance', label: 'Danza' },
    { value: 'performance', label: 'Performance' },
  ],
  festivals: [
    { value: 'local_fairs', label: 'Ferias locales' },
    { value: 'markets', label: 'Mercados' },
    { value: 'food_trucks', label: 'Food trucks' },
    { value: 'cultural_festivals', label: 'Festivales culturales' },
    { value: 'medieval_fairs', label: 'Ferias medievales' },
    { value: 'themed_events', label: 'Eventos temáticos' },
  ],
  food: [
    { value: 'tastings', label: 'Catas' },
    { value: 'brunch', label: 'Brunch' },
    { value: 'food_events', label: 'Food events' },
    { value: 'tapas', label: 'Tapas' },
    { value: 'wine', label: 'Vinos' },
    { value: 'craft_beer', label: 'Cervezas artesanas' },
    { value: 'food_popups', label: 'Pop-ups gastronómicos' },
  ],
  family: [
    { value: 'kids_workshops', label: 'Talleres infantiles' },
    { value: 'storytelling', label: 'Cuentacuentos' },
    { value: 'family_activities', label: 'Actividades familiares' },
    { value: 'kids_shows', label: 'Espectáculos infantiles' },
    { value: 'parties', label: 'Fiestas' },
  ],
  cinema: [
    { value: 'cinema_show', label: 'Cine' },
    { value: 'documentaries', label: 'Documentales' },
    { value: 'short_films', label: 'Cortometrajes' },
    { value: 'film_forum', label: 'Cine fórum' },
    { value: 'screenings', label: 'Proyecciones' },
  ],
  art: [
    { value: 'exhibitions', label: 'Exposiciones' },
    { value: 'museums', label: 'Museos' },
    { value: 'photography', label: 'Fotografía' },
    { value: 'urban_art', label: 'Arte urbano' },
    { value: 'galleries', label: 'Galerías' },
    { value: 'openings', label: 'Inauguraciones' },
  ],
  workshops: [
    { value: 'ceramics', label: 'Cerámica' },
    { value: 'painting', label: 'Pintura' },
    { value: 'writing', label: 'Escritura' },
    { value: 'cooking', label: 'Cocina' },
    { value: 'photo_workshop', label: 'Fotografía' },
    { value: 'creativity', label: 'Creatividad' },
    { value: 'languages', label: 'Idiomas' },
  ],
  networking: [
    { value: 'networking_event', label: 'Networking' },
    { value: 'entrepreneurship', label: 'Emprendimiento' },
    { value: 'startups', label: 'Startups' },
    { value: 'talks', label: 'Charlas' },
    { value: 'conferences', label: 'Conferencias' },
    { value: 'meetups', label: 'Meetups' },
  ],
  sports: [
    { value: 'running', label: 'Running' },
    { value: 'yoga', label: 'Yoga' },
    { value: 'hiking', label: 'Senderismo' },
    { value: 'fitness', label: 'Fitness' },
    { value: 'tournaments', label: 'Torneos' },
    { value: 'outdoor', label: 'Actividades al aire libre' },
  ],
  nightlife: [
    { value: 'parties', label: 'Fiestas' },
    { value: 'clubs', label: 'Clubs' },
    { value: 'sessions', label: 'Sessions' },
    { value: 'afterworks', label: 'Afterworks' },
    { value: 'karaoke', label: 'Karaoke' },
    { value: 'open_format', label: 'Open format' },
  ],
  traditions: [
    { value: 'festa_major', label: 'Festa Major' },
    { value: 'castellers', label: 'Castellers' },
    { value: 'sardanes', label: 'Sardanas' },
    { value: 'correfoc', label: 'Correfoc' },
    { value: 'diades', label: 'Diadas' },
    { value: 'catalan_culture', label: 'Cultura catalana' },
  ],
  solidarity: [
    { value: 'ngo', label: 'ONG' },
    { value: 'volunteering', label: 'Voluntariado' },
    { value: 'charity_events', label: 'Eventos benéficos' },
    { value: 'local_community', label: 'Comunidad local' },
  ],
  university: [
    { value: 'upc_events', label: 'Eventos UPC' },
    { value: 'university_life', label: 'Vida universitaria' },
    { value: 'associations', label: 'Asociaciones' },
    { value: 'youth_events', label: 'Eventos jóvenes' },
  ],
  tech: [
    { value: 'gaming', label: 'Gaming' },
    { value: 'ai', label: 'IA' },
    { value: 'technology', label: 'Tecnología' },
    { value: 'esports', label: 'eSports' },
    { value: 'lan_parties', label: 'LAN parties' },
  ],
  wellness: [
    { value: 'meditation', label: 'Meditación' },
    { value: 'yoga_wellness', label: 'Yoga' },
    { value: 'mindfulness', label: 'Mindfulness' },
    { value: 'wellness', label: 'Wellness' },
    { value: 'therapies', label: 'Terapias' },
  ],
}

export const CATEGORY_LABELS: Record<EventCategory, string> = {
  music: 'Música',
  theatre: 'Teatro y Artes Escénicas',
  festivals: 'Festivales y Ferias',
  food: 'Gastronomía',
  family: 'Infantil y Familiar',
  cinema: 'Cine y Audiovisual',
  art: 'Arte y Exposiciones',
  workshops: 'Talleres y Cursos',
  networking: 'Networking y Profesional',
  sports: 'Deportes y Outdoor',
  nightlife: 'Vida Nocturna',
  traditions: 'Tradiciones y Cultura Popular',
  solidarity: 'Solidario y Comunidad',
  university: 'Universitario y Joven',
  tech: 'Tecnología y Gaming',
  wellness: 'Bienestar y Espiritualidad',
}

export type EventStatus = 'pending' | 'approved' | 'rejected'

export type SubscriptionTier = 'free' | 'basic' | 'premium'

export type UserRole = 'organizer' | 'admin'

// ─── Database row types (mirrors Supabase schema) ────────────────────────────

export interface City {
  id: string
  name: string
  slug: string
  config: CityConfig
  created_at: string
}

export interface CityConfig {
  primaryColor: string
  secondaryColor: string
  appName: string
  logoUrl?: string
}

export interface Profile {
  id: string
  email: string
  organization_name: string
  city_id: string
  subscription_tier: SubscriptionTier
  posts_used_this_month: number
  subscription_period_start: string | null
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  role: UserRole
  created_at: string
  default_location_text: string | null
  default_latitude: number | null
  default_longitude: number | null
}

export interface Event {
  id: string
  city_id: string
  organizer_id: string
  title: string
  description: string
  category: EventCategory
  subcategory: EventSubcategory | null
  start_date: string        // ISO date string YYYY-MM-DD
  end_date: string | null   // ISO date string YYYY-MM-DD
  start_time: string | null // HH:MM:SS or null
  end_time: string | null   // HH:MM:SS or null
  price: number | null      // null = free / price TBD
  location_text: string
  latitude: number
  longitude: number
  poster_url: string | null
  website: string | null
  status: EventStatus
  rejection_reason: string | null
  created_at: string
  updated_at: string
}

export interface PushToken {
  id: string
  device_token: string
  city_slug: string
  created_at: string
}

export interface OrganizerLocation {
  id: string
  organizer_id: string
  label: string
  location_text: string
  latitude: number
  longitude: number
  created_at: string
}

export interface AppUser {
  id: string
  email: string
  display_name: string | null
  created_at: string
}

// ─── Subscription limits ──────────────────────────────────────────────────────

export const SUBSCRIPTION_LIMITS: Record<SubscriptionTier, number> = {
  free: 1,
  basic: 10,
  premium: 100,
}

export const SUBSCRIPTION_PRICES = {
  basic: { amountCents: 999, currency: 'eur', label: '€9,99 / mes' },
  premium: { amountCents: 10000, currency: 'eur', label: '€100 / mes' },
} as const

// ─── API / form types ─────────────────────────────────────────────────────────

export interface CreateEventInput {
  title: string
  description: string
  category: EventCategory
  subcategory?: EventSubcategory | null
  start_date: string
  start_time?: string | null
  end_time?: string | null
  price?: number | null
  location_text: string
  latitude: number
  longitude: number
  poster_url?: string | null
  website?: string | null
}

export interface UpdateEventInput extends Partial<CreateEventInput> {
  id: string
}

export interface ApproveEventInput {
  event_id: string
}

export interface RejectEventInput {
  event_id: string
  rejection_reason: string
}

// ─── Extended types (with joins) ──────────────────────────────────────────────

export interface EventWithOrganizer extends Event {
  profiles: Pick<Profile, 'organization_name' | 'email'>
}

export interface EventWithCity extends Event {
  cities: Pick<City, 'name' | 'slug'>
}
