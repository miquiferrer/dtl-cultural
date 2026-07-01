#!/usr/bin/env node
import { Command } from 'commander'
import path from 'path'
import { scrapeText, fetchOgImage } from './scraper.js'
import { extractEvents } from './extract.js'
import { geocodeWithFallback } from './geocode.js'
import { writeCsv } from './csv.js'
import { uploadEvents } from './upload.js'

const program = new Command()

program
  .name('scrape-events')
  .description('Scrape cultural events from a webpage and export them to a CSV file')
  .requiredOption('--url <url>', 'URL of the events page to scrape')
  .option('--output <file>', 'Output CSV file path (default: events-<timestamp>.csv)')
  .option('--model <model>', 'Gemini model to use', 'gemini-2.5-flash')
  // Upload flags (all required together when --upload is set)
  .option('--upload', 'Upload events to Supabase after extraction')
  .option('--city <slug>', 'City slug to assign events to (required with --upload)')
  .option('--organizer-email <email>', 'Organizer email to attribute events to (required with --upload)')
  .option('--lat <degrees>', 'Fallback latitude (decimal degrees) if geocoding yields no result')
  .option('--lon <degrees>', 'Fallback longitude (decimal degrees) if geocoding yields no result')
  .option('--default-image <url>', 'Fallback poster image URL for events that have no image after all other attempts')

program.parse(process.argv)

const opts = program.opts<{
  url: string
  output?: string
  model: string
  upload?: boolean
  city?: string
  organizerEmail?: string
  lat?: string
  lon?: string
  defaultImage?: string
}>()

async function main() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.error('Error: GEMINI_API_KEY environment variable is not set.')
    console.error('Usage: GEMINI_API_KEY=AIza... npx tsx index.ts --url "https://..."')
    process.exit(1)
  }

  // Validate upload flags up-front
  if (opts.upload) {
    const supabaseUrl = process.env.SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseUrl || !serviceRoleKey) {
      console.error('Error: --upload requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars.')
      process.exit(1)
    }
    if (!opts.city) {
      console.error('Error: --upload requires --city <slug>')
      process.exit(1)
    }
    if (!opts.organizerEmail) {
      console.error('Error: --upload requires --organizer-email <email>')
      process.exit(1)
    }
  }

  const outputPath = path.resolve(
    opts.output ?? `events-${new Date().toISOString().slice(0, 10)}.csv`,
  )

  // ── Step 1: Fetch and clean the page ───────────────────────────────────────
  console.log(`\n🌐 Fetching: ${opts.url}`)
  let scrapeResult
  try {
    scrapeResult = await scrapeText(opts.url)
  } catch (err) {
    console.error(`Error fetching page: ${(err as Error).message}`)
    process.exit(1)
  }
  console.log(
    `   Extracted ${scrapeResult.text.length.toLocaleString()} chars of text, ` +
      `${scrapeResult.imageCandidates.length} candidate images.`,
  )

  // ── Step 2: Extract events + venue with Gemini ─────────────────────────────
  console.log(`\n🤖 Sending to Gemini (${opts.model})...`)
  let extraction
  try {
    extraction = await extractEvents(
      scrapeResult.text,
      opts.url,
      scrapeResult.imageCandidates,
      apiKey,
      opts.model,
    )
  } catch (err) {
    console.error(`Error calling Gemini: ${(err as Error).message}`)
    process.exit(1)
  }

  const { venue, events } = extraction

  if (events.length === 0) {
    console.log('\n⚠️  No events found on this page. No file written.')
    process.exit(0)
  }

  console.log(`   Found ${events.length} event${events.length === 1 ? '' : 's'}.`)

  // ── Step 3: Geocode the shared venue location ──────────────────────────────
  const venueLabel = [venue.name, venue.address].filter(Boolean).join(', ')
  const locationText = venueLabel || opts.url

  console.log(`\n📍 Venue: ${venueLabel || '(unknown)'}`)
  let lat = ''
  let lng = ''

  // Priority 1: coordinates embedded in the page HTML (JSON-LD, meta tags, Maps embed, etc.)
  if (scrapeResult.coordinates) {
    lat = String(scrapeResult.coordinates.lat)
    lng = String(scrapeResult.coordinates.lng)
    console.log(`   Coordinates: ${lat}, ${lng}  (via page HTML)`)
  } else {
    // Priority 2: multi-step geocoding fallback
    // Nominatim: full label → address only → venue name only
    // Google Maps API: final fallback if GOOGLE_MAPS_API_KEY is set
    const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY
    if (googleMapsApiKey) {
      console.log('   Geocoding (Nominatim → Google Maps API fallback)...')
    } else {
      console.log('   Geocoding via OpenStreetMap Nominatim...')
    }

    try {
      const result = await geocodeWithFallback(venue.name, venue.address, googleMapsApiKey)
      if (result) {
        lat = String(result.coords.latitude)
        lng = String(result.coords.longitude)
        console.log(`   Coordinates: ${lat}, ${lng}  (via ${result.via})`)
      } else if (opts.lat && opts.lon) {
        lat = opts.lat
        lng = opts.lon
        console.log(`   Coordinates: ${lat}, ${lng}  (via --lat/--lon fallback)`)
      } else {
        console.log('   ⚠️  No coordinates found — latitude/longitude will be empty.')
        if (!googleMapsApiKey) {
          console.log('       Tip: set GOOGLE_MAPS_API_KEY or pass --lat/--lon as a fallback.')
        }
      }
    } catch (err) {
      console.warn(`   Geocoding failed: ${(err as Error).message}`)
    }
  }

  // ── Step 4: Stamp all events with venue location + coordinates ─────────────
  const stamped = events.map((e) => ({
    ...e,
    location_text: locationText,
    latitude: lat,
    longitude: lng,
  }))

  // ── Step 4.5: Fill missing poster_url from each event's own page ───────────
  const missing = stamped.filter((e) => !e.poster_url && e.website)
  if (missing.length > 0) {
    console.log(`\n🖼  Fetching OG images for ${missing.length} event(s) without a poster...`)
    // Run up to 5 fetches concurrently
    const CONCURRENCY = 5
    for (let i = 0; i < missing.length; i += CONCURRENCY) {
      const batch = missing.slice(i, i + CONCURRENCY)
      await Promise.all(
        batch.map(async (e) => {
          const img = await fetchOgImage(e.website)
          if (img) {
            e.poster_url = img
            console.log(`   ✔ ${e.title}`)
          }
        }),
      )
    }
  }

  // ── Step 4.6: Apply --default-image for any event still without a poster ───
  if (opts.defaultImage) {
    let filled = 0
    for (const e of stamped) {
      if (!e.poster_url) {
        e.poster_url = opts.defaultImage
        filled++
      }
    }
    if (filled > 0) {
      console.log(`\n🖼  Applied default image to ${filled} event(s) with no poster.`)
    }
  }

  // ── Step 5: Write CSV ──────────────────────────────────────────────────────
  try {
    writeCsv(stamped, outputPath)
  } catch (err) {
    console.error(`Error writing CSV: ${(err as Error).message}`)
    process.exit(1)
  }

  console.log(`\n✅ Written to: ${outputPath}`)
  console.log('\nColumns: title, description, category, start_date, end_date,')
  console.log('         location_text, latitude, longitude, price, website, poster_url\n')

  // Quick preview
  const preview = stamped.slice(0, 3)
  console.log('Preview:')
  preview.forEach((e, i) => {
    const poster = e.poster_url ? ' 🖼' : ''
    console.log(`  ${i + 1}. [${e.category}] ${e.title} — ${e.start_date}${poster}`)
  })
  if (stamped.length > 3) {
    console.log(`  ... and ${stamped.length - 3} more.`)
  }
  console.log()

  // ── Step 6 (optional): Upload to Supabase ──────────────────────────────────
  if (opts.upload) {
    console.log(`\n☁️  Uploading to Supabase (city: ${opts.city}, organizer: ${opts.organizerEmail})...`)
    try {
      const result = await uploadEvents(stamped, {
        supabaseUrl: process.env.SUPABASE_URL!,
        serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        citySlug: opts.city!,
        organizerEmail: opts.organizerEmail!,
      })

      console.log(`   ✅ Inserted: ${result.inserted}`)
      if (result.skipped > 0) {
        console.log(`   ⏭  Skipped:  ${result.skipped}`)
      }
      if (result.errors.length > 0) {
        console.log('\n   Skip reasons:')
        result.errors.forEach((e) => console.log(`     • ${e}`))
      }
    } catch (err) {
      console.error(`\n   Upload failed: ${(err as Error).message}`)
      process.exit(1)
    }
  }

  console.log()
}

main()
