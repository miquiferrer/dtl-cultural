import { createClient } from '@supabase/supabase-js'
import type { EventRow } from './types.js'

export interface UploadOptions {
  supabaseUrl: string
  serviceRoleKey: string
  citySlug: string
  organizerEmail: string
}

export interface UploadResult {
  inserted: number
  skipped: number
  errors: string[]
}

/**
 * Bulk-inserts scraped events into Supabase.
 * Uses the service role key to bypass RLS.
 * Skips events that are missing title or start_date.
 * Deduplicates against existing events by title + start_date + city.
 */
export async function uploadEvents(
  events: EventRow[],
  opts: UploadOptions,
): Promise<UploadResult> {
  const supabase = createClient(opts.supabaseUrl, opts.serviceRoleKey, {
    auth: { persistSession: false },
  })

  // ── Resolve city slug → city_id ───────────────────────────────────────────
  const { data: city, error: cityError } = await supabase
    .from('cities')
    .select('id')
    .eq('slug', opts.citySlug)
    .single()

  if (cityError || !city) {
    throw new Error(
      `City "${opts.citySlug}" not found. Check the slug matches a row in the cities table.`,
    )
  }

  // ── Resolve organizer email → organizer_id ────────────────────────────────
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', opts.organizerEmail)
    .single()

  if (profileError || !profile) {
    throw new Error(
      `Organizer "${opts.organizerEmail}" not found. Make sure the account exists in the profiles table.`,
    )
  }

  // ── Fetch existing (title, start_date) pairs to skip duplicates ───────────
  const { data: existing } = await supabase
    .from('events')
    .select('title, start_date')
    .eq('city_id', city.id)

  const existingKeys = new Set(
    (existing ?? []).map((e) => `${e.title}||${e.start_date}`),
  )

  // ── Build rows to insert ──────────────────────────────────────────────────
  const errors: string[] = []
  const rows: Record<string, unknown>[] = []

  for (const e of events) {
    if (!e.title || !e.start_date) {
      errors.push(`Skipped (missing title or start_date): "${e.title ?? '(no title)'}"`)
      continue
    }

    const key = `${e.title}||${e.start_date}`
    if (existingKeys.has(key)) {
      errors.push(`Skipped (duplicate): "${e.title}" on ${e.start_date}`)
      continue
    }

    rows.push({
      city_id: city.id,
      organizer_id: profile.id,
      title: e.title,
      description: e.description || '',
      category: e.category,
      start_date: e.start_date,
      end_date: e.end_date || null,
      location_text: e.location_text || '',
      latitude: e.latitude ? parseFloat(e.latitude) : null,
      longitude: e.longitude ? parseFloat(e.longitude) : null,
      price: e.price ? parseFloat(e.price) : null,
      website: e.website || null,
      poster_url: e.poster_url || null,
      status: 'approved',
    })
  }

  if (rows.length === 0) {
    return { inserted: 0, skipped: events.length, errors }
  }

  // ── Insert in batches of 50 ───────────────────────────────────────────────
  const BATCH = 50
  let inserted = 0

  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH)
    const { error: insertError } = await supabase.from('events').insert(batch)
    if (insertError) {
      throw new Error(`Insert failed (batch ${Math.floor(i / BATCH) + 1}): ${insertError.message}`)
    }
    inserted += batch.length
  }

  return { inserted, skipped: events.length - inserted, errors }
}
