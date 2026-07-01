// Supabase Edge Function: send-event-alerts
// Called when an event's status changes to 'approved'.
// Sends a branded email to app_users who have opted in for that event's
// category (and, optionally, specific subcategories).
//
// Required env vars:
//   RESEND_API_KEY   — Resend API key
// Optional env vars:
//   FROM_EMAIL       — sender address (default: noreply@dtlcultural.com)
//   APP_LOGO_URL     — publicly accessible logo image URL for the email header
//   APP_NAME         — app display name (default: Agenda Cultural de Terrassa)
//   APP_URL          — link to the web app shown in the footer

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

const RESEND_API_URL = 'https://api.resend.com/emails'
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') ?? 'Agenda Cultural <noreply@dtlcultural.com>'
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const APP_LOGO_URL = Deno.env.get('APP_LOGO_URL') ?? ''
const APP_NAME = Deno.env.get('APP_NAME') ?? 'Agenda Cultural de Terrassa'
const APP_URL = Deno.env.get('APP_URL') ?? ''

// ─── Label maps (mirrors @dtl-cultural/shared) ────────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
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
  tech: 'Tech',
  wellness: 'Bienestar',
}

const SUBCATEGORY_LABELS: Record<string, string> = {
  concerts: 'Conciertos', dj_electronic: 'DJ / Electrónica', jazz: 'Jazz',
  rock: 'Rock', indie: 'Indie', classical: 'Clásica', flamenco: 'Flamenco',
  urban_music: 'Música urbana', festivals_music: 'Festivales', jam_sessions: 'Jam sessions',
  theatre_show: 'Teatro', monologues: 'Monólogos', improv: 'Improvisación',
  musicals: 'Musicales', circus: 'Circo', dance: 'Danza', performance: 'Performance',
  local_fairs: 'Ferias locales', markets: 'Mercados', food_trucks: 'Food trucks',
  cultural_festivals: 'Festivales culturales', medieval_fairs: 'Ferias medievales',
  themed_events: 'Eventos temáticos', tastings: 'Catas', brunch: 'Brunch',
  food_events: 'Food events', tapas: 'Tapas', wine: 'Vinos',
  craft_beer: 'Cervezas artesanas', food_popups: 'Pop-ups gastronómicos',
  kids_workshops: 'Talleres infantiles', storytelling: 'Cuentacuentos',
  family_activities: 'Actividades familiares', kids_shows: 'Espectáculos infantiles',
  parties: 'Fiestas', cinema_show: 'Cine', documentaries: 'Documentales',
  short_films: 'Cortometrajes', film_forum: 'Cine fórum', screenings: 'Proyecciones',
  exhibitions: 'Exposiciones', museums: 'Museos', photography: 'Fotografía',
  urban_art: 'Arte urbano', galleries: 'Galerías', openings: 'Inauguraciones',
  ceramics: 'Cerámica', painting: 'Pintura', writing: 'Escritura',
  cooking: 'Cocina', photo_workshop: 'Taller de fotografía', creativity: 'Creatividad',
  languages: 'Idiomas', networking_event: 'Networking', entrepreneurship: 'Emprendimiento',
  startups: 'Startups', talks: 'Charlas', conferences: 'Conferencias', meetups: 'Meetups',
  running: 'Running', yoga: 'Yoga', hiking: 'Senderismo', fitness: 'Fitness',
  tournaments: 'Torneos', outdoor: 'Actividades al aire libre',
  clubs: 'Clubs', sessions: 'Sessions', afterworks: 'Afterworks',
  karaoke: 'Karaoke', open_format: 'Open format',
  festa_major: 'Festa Major', castellers: 'Castellers', sardanes: 'Sardanas',
  correfoc: 'Correfoc', diades: 'Diadas', catalan_culture: 'Cultura catalana',
  ngo: 'ONG', volunteering: 'Voluntariado', charity_events: 'Eventos benéficos',
  local_community: 'Comunidad local', upc_events: 'Eventos UPC',
  university_life: 'Vida universitaria', associations: 'Asociaciones',
  youth_events: 'Eventos jóvenes', gaming: 'Gaming', ai: 'IA',
  technology: 'Tecnología', esports: 'eSports', lan_parties: 'LAN parties',
  meditation: 'Meditación', yoga_wellness: 'Yoga', mindfulness: 'Mindfulness',
  wellness: 'Wellness', therapies: 'Terapias',
}

interface Payload {
  event_id: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr + 'T12:00:00Z')
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

// Determine if a user's preferences match the given event category + subcategory
function userMatchesEvent(
  user: { notification_preferences?: Record<string, string[]>; notification_categories?: string[] },
  eventCategory: string,
  eventSubcategory: string | null,
): boolean {
  const prefs = user.notification_preferences ?? {}

  if (Object.keys(prefs).length > 0) {
    // New system: jsonb prefs { category: subcategory[] }
    if (!(eventCategory in prefs)) return false
    const allowedSubs: string[] = prefs[eventCategory] ?? []
    if (allowedSubs.length === 0) return true        // all subcategories
    if (!eventSubcategory) return true               // no subcategory on event
    return allowedSubs.includes(eventSubcategory)
  }

  // Legacy fallback: flat notification_categories array
  return (user.notification_categories ?? []).includes(eventCategory)
}

// ─── Email template ───────────────────────────────────────────────────────────

function buildEmailHtml(event: Record<string, unknown>, cityName: string): string {
  const title = escapeHtml(String(event.title ?? ''))
  const description = event.description ? escapeHtml(String(event.description)) : ''
  const dateLabel = formatDate(String(event.start_date ?? ''))
  const timeLabel = event.start_time ? String(event.start_time).slice(0, 5) : ''
  const locationLabel = event.location_text ? escapeHtml(String(event.location_text)) : ''
  const priceLabel = event.price != null ? `€${event.price}` : 'Por definir'
  const categoryLabel = CATEGORY_LABELS[String(event.category)] ?? String(event.category)
  const subcategoryLabel = event.subcategory
    ? (SUBCATEGORY_LABELS[String(event.subcategory)] ?? String(event.subcategory))
    : null
  const posterUrl = event.poster_url ? String(event.poster_url) : ''
  const websiteUrl = event.website ? String(event.website) : ''
  const cityEscaped = escapeHtml(cityName)

  // Header logo or branded text
  const logoBlock = APP_LOGO_URL
    ? `<img src="${APP_LOGO_URL}" width="72" height="72" alt="${APP_NAME}" style="border-radius:14px; display:block; margin:0 auto 12px;"/>`
    : `<div style="width:72px; height:72px; background:rgba(255,255,255,0.25); border-radius:14px; margin:0 auto 12px; display:flex; align-items:center; justify-content:center; font-size:32px;">🎭</div>`

  // Hero image (poster) if available
  const heroBlock = posterUrl
    ? `<tr><td style="padding:0; line-height:0;"><img src="${posterUrl}" width="600" alt="${title}" style="width:100%; max-width:600px; display:block; object-fit:cover; max-height:280px;"/></td></tr>`
    : ''

  // Category + subcategory badges
  const catBadge = `<span style="display:inline-block; background:#fff3e0; color:#e07b10; border:1.5px solid #f4921e; border-radius:20px; padding:3px 12px; font-size:12px; font-weight:700; letter-spacing:0.3px;">${categoryLabel}</span>`
  const subcatBadge = subcategoryLabel
    ? `&nbsp;<span style="display:inline-block; background:#f5f5f5; color:#666; border:1px solid #ddd; border-radius:20px; padding:3px 12px; font-size:12px; font-weight:600;">${subcategoryLabel}</span>`
    : ''

  // Date / time / location / price rows
  const detailRows = [
    `<tr><td style="padding:10px 0; border-bottom:1px solid #f0ebe0; font-size:14px; color:#1e2640;">
      <span style="font-size:16px; vertical-align:middle;">📅</span>&nbsp;
      <strong>${dateLabel}${timeLabel ? `&nbsp;·&nbsp;${timeLabel}` : ''}</strong>
    </td></tr>`,
    locationLabel
      ? `<tr><td style="padding:10px 0; border-bottom:1px solid #f0ebe0; font-size:14px; color:#1e2640;">
          <span style="font-size:16px; vertical-align:middle;">📍</span>&nbsp;<strong>${locationLabel}</strong>
        </td></tr>`
      : '',
    `<tr><td style="padding:10px 0; border-bottom:1px solid #f0ebe0; font-size:14px; color:#1e2640;">
      <span style="font-size:16px; vertical-align:middle;">🎟️</span>&nbsp;<strong>${priceLabel}</strong>
    </td></tr>`,
    cityEscaped
      ? `<tr><td style="padding:10px 0; font-size:14px; color:#1e2640;">
          <span style="font-size:16px; vertical-align:middle;">🏙️</span>&nbsp;<strong>${cityEscaped}</strong>
        </td></tr>`
      : '',
  ].filter(Boolean).join('\n')

  // Description
  const descriptionBlock = description
    ? `<p style="font-size:14px; color:#555; line-height:1.75; margin:20px 0 24px; white-space:pre-line;">${description}</p>`
    : ''

  // CTA button
  const ctaBlock = websiteUrl
    ? `<table cellpadding="0" cellspacing="0" style="margin:0 auto;">
        <tr><td style="background:#f4921e; border-radius:10px;">
          <a href="${websiteUrl}" style="display:inline-block; padding:12px 28px; color:#fff; font-size:15px; font-weight:700; text-decoration:none; letter-spacing:0.3px;">Más información →</a>
        </td></tr>
      </table>`
    : ''

  // Footer links
  const footerLink = APP_URL
    ? `<a href="${APP_URL}" style="color:#f4921e; text-decoration:none;">${APP_URL}</a>`
    : APP_NAME

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${title}</title></head>
<body style="margin:0; padding:0; background:#f0ece2; font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" role="presentation">
  <tr><td align="center" style="padding:32px 16px;">

    <!-- Email card -->
    <table width="600" cellpadding="0" cellspacing="0" role="presentation"
      style="max-width:600px; width:100%; background:#ffffff; border-radius:18px; overflow:hidden;
             box-shadow:0 4px 32px rgba(0,0,0,0.10);">

      <!-- ── HEADER ── -->
      <tr><td style="background:linear-gradient(135deg,#f4921e 0%,#e07010 100%); padding:36px 28px 28px; text-align:center;">
        ${logoBlock}
        <h1 style="margin:0 0 6px; color:#ffffff; font-size:22px; font-weight:800; letter-spacing:-0.4px;">${APP_NAME}</h1>
        <p style="margin:0; color:rgba(255,255,255,0.82); font-size:13px; font-weight:500; letter-spacing:0.5px; text-transform:uppercase;">Nuevo evento publicado</p>
      </td></tr>

      <!-- ── POSTER IMAGE (if available) ── -->
      ${heroBlock}

      <!-- ── CONTENT ── -->
      <tr><td style="padding:28px 32px 32px;">

        <!-- Badges -->
        <div style="margin-bottom:16px;">${catBadge}${subcatBadge}</div>

        <!-- Title -->
        <h2 style="margin:0 0 22px; font-size:26px; font-weight:800; color:#1e2640; line-height:1.25;">${title}</h2>

        <!-- Detail rows -->
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:20px;">
          ${detailRows}
        </table>

        <!-- Description -->
        ${descriptionBlock}

        <!-- CTA -->
        ${ctaBlock}

      </td></tr>

      <!-- ── DIVIDER ── -->
      <tr><td style="padding:0 32px;"><div style="border-top:1px solid #ede8de;"></div></td></tr>

      <!-- ── FOOTER ── -->
      <tr><td style="background:#faf7f0; padding:20px 32px; text-align:center; border-radius:0 0 18px 18px;">
        <p style="margin:0 0 6px; font-size:12px; color:#aaa; line-height:1.6;">
          Has recibido este email porque te has suscrito a alertas de eventos.<br/>
          Para gestionar tus preferencias, accede a <strong>Ajustes</strong> en la app.
        </p>
        <p style="margin:0; font-size:12px; color:#ccc;">${footerLink}</p>
      </td></tr>

    </table>
  </td></tr>
</table>

</body>
</html>`
}

// ─── Handler ──────────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  let payload: Payload
  try {
    payload = await req.json()
  } catch {
    return new Response('Invalid JSON body', { status: 400 })
  }

  if (!payload.event_id) {
    return new Response('Missing event_id', { status: 400 })
  }

  // Fetch event details (including subcategory + poster)
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('id, title, description, category, subcategory, start_date, start_time, end_date, location_text, price, website, poster_url, cities(name)')
    .eq('id', payload.event_id)
    .single()

  if (eventError || !event) {
    console.error('Event not found:', eventError)
    return new Response('Event not found', { status: 404 })
  }

  // Fetch all users with email alerts enabled
  const { data: users, error: usersError } = await supabase
    .from('app_users')
    .select('id, email, display_name, notification_preferences, notification_categories')
    .eq('notify_by_email', true)

  if (usersError) {
    console.error('Error fetching users:', usersError)
    return new Response('Failed to fetch users', { status: 500 })
  }

  // Filter users whose preferences match this event's category + subcategory
  const eventCategory = String((event as any).category ?? '')
  const eventSubcategory = (event as any).subcategory ? String((event as any).subcategory) : null

  const matchingUsers = (users ?? []).filter((u) =>
    userMatchesEvent(u as any, eventCategory, eventSubcategory),
  )

  if (matchingUsers.length === 0) {
    return new Response(JSON.stringify({ sent: 0 }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (!RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set — skipping email delivery')
    return new Response(JSON.stringify({ sent: 0, reason: 'no_api_key' }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const cityName = (event as any).cities?.name ?? ''
  const htmlBody = buildEmailHtml(event as Record<string, unknown>, cityName)
  const subject = `🎉 Nuevo evento: ${(event as any).title}`

  let sent = 0
  const errors: string[] = []

  for (const user of matchingUsers) {
    try {
      const res = await fetch(RESEND_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: [(user as any).email],
          subject,
          html: htmlBody,
        }),
      })

      if (res.ok) {
        sent++
      } else {
        const body = await res.text()
        errors.push(`${(user as any).email}: ${body}`)
      }
    } catch (err) {
      errors.push(`${(user as any).email}: ${String(err)}`)
    }
  }

  console.log(`send-event-alerts: sent=${sent}/${matchingUsers.length}, errors=${errors.length}`)
  if (errors.length > 0) console.error('Send errors:', errors)

  return new Response(
    JSON.stringify({ sent, total_matched: matchingUsers.length, errors: errors.length > 0 ? errors : undefined }),
    { headers: { 'Content-Type': 'application/json' } },
  )
})
