// Matches the app's Event schema fields that can be extracted from a webpage.
// Fields like id, city_id, organizer_id, status, created_at are omitted
// (they are filled in by the app on import).
export interface EventRow {
  title: string
  description: string
  category: 'music' | 'theatre' | 'food' | 'other'
  start_date: string   // YYYY-MM-DD
  end_date: string     // YYYY-MM-DD or empty string
  location_text: string
  latitude: string     // decimal degrees or empty string
  longitude: string    // decimal degrees or empty string
  price: string        // numeric string (e.g. "5.00") or empty string = free
  website: string      // full URL or empty string
  poster_url: string   // full URL or empty string
}

/** Venue extracted from the source page — shared across all events. */
export interface VenueInfo {
  name: string
  address: string
}

export const CSV_HEADERS: (keyof EventRow)[] = [
  'title',
  'description',
  'category',
  'start_date',
  'end_date',
  'location_text',
  'latitude',
  'longitude',
  'price',
  'website',
  'poster_url',
]
