const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search'
const GOOGLE_GEOCODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json'

export interface Coordinates {
  latitude: number
  longitude: number
}

/**
 * Geocodes a free-text location query using OpenStreetMap Nominatim.
 * No API key required — only requires a descriptive User-Agent.
 * Returns null if no result is found.
 */
export async function geocode(query: string): Promise<Coordinates | null> {
  if (!query.trim()) return null

  const url =
    `${NOMINATIM_URL}?` +
    new URLSearchParams({
      q: query,
      format: 'json',
      limit: '1',
      addressdetails: '0',
    }).toString()

  const response = await fetch(url, {
    headers: {
      // Nominatim requires a descriptive User-Agent per their usage policy
      'User-Agent': 'EventScraper/1.0 (dtl-cultural; contact@dtlcultural.com)',
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Nominatim error: HTTP ${response.status}`)
  }

  const results = (await response.json()) as Array<{ lat: string; lon: string }>
  if (!results[0]) return null

  return {
    latitude: parseFloat(results[0].lat),
    longitude: parseFloat(results[0].lon),
  }
}

/**
 * Geocodes using the Google Maps Geocoding API.
 * Requires a valid API key with the Geocoding API enabled.
 * Returns null if no result is found.
 */
async function geocodeGoogleMaps(query: string, apiKey: string): Promise<Coordinates | null> {
  const url =
    `${GOOGLE_GEOCODE_URL}?` +
    new URLSearchParams({ address: query, key: apiKey }).toString()

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Google Maps Geocoding API error: HTTP ${response.status}`)
  }

  const data = (await response.json()) as {
    status: string
    results: Array<{ geometry: { location: { lat: number; lng: number } } }>
  }

  if (data.status !== 'OK' || !data.results[0]) return null

  const loc = data.results[0].geometry.location
  return { latitude: loc.lat, longitude: loc.lng }
}

/**
 * Tries to geocode with several fallback strategies in order:
 *  1. Full venue label  (venueName + address)  — Nominatim
 *  2. Address only                              — Nominatim
 *  3. Venue name only                           — Nominatim
 *  4. Best query                                — Google Maps API (if key provided)
 *
 * Returns the first successful result, or null if all strategies fail.
 * Also returns a label describing which strategy succeeded for logging.
 */
export async function geocodeWithFallback(
  venueName: string,
  address: string,
  googleMapsApiKey?: string,
): Promise<{ coords: Coordinates; via: string } | null> {
  // Build candidate queries in order of decreasing specificity, deduped
  const candidates = [
    { query: [venueName, address].filter(Boolean).join(', '), label: 'full label' },
    { query: address, label: 'address' },
    { query: venueName, label: 'venue name' },
  ].filter((c, i, arr) => c.query.trim() && arr.findIndex((x) => x.query === c.query) === i)

  // Try Nominatim for each candidate
  for (const { query, label } of candidates) {
    try {
      const coords = await geocode(query)
      if (coords) return { coords, via: `Nominatim (${label})` }
    } catch {
      // try next
    }
  }

  // Final fallback: Google Maps Geocoding API
  if (googleMapsApiKey && candidates[0]) {
    try {
      const coords = await geocodeGoogleMaps(candidates[0].query, googleMapsApiKey)
      if (coords) return { coords, via: 'Google Maps API' }
    } catch {
      // no result
    }
  }

  return null
}
