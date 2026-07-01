import * as cheerio from 'cheerio'

const MAX_CHARS = 12_000

/** A candidate event poster image together with contextual clues from the DOM. */
export interface ImageCandidate {
  /** Absolute URL of the image. */
  url: string
  /** The img alt text, title attribute, or aria-label (empty string if none). */
  alt: string
  /**
   * Text content of the nearest card-like ancestor element (trimmed, ≤ 200 chars).
   * This typically contains the event title, date, and category — allowing the LLM
   * to reliably match the image to the right event even when the URL is opaque.
   */
  containerText: string
}

export interface ScrapeResult {
  text: string
  /** Flat list of unique image URLs (subset of imageCandidates, preserved for quick access). */
  imageUrls: string[]
  /** Richer image list with alt text and DOM context — preferred for LLM matching. */
  imageCandidates: ImageCandidate[]
  baseUrl: string
  /** Coordinates extracted directly from the page HTML, or null if not found. */
  coordinates: { lat: number; lng: number } | null
}

/**
 * Attempts to extract geo-coordinates directly from raw HTML without any
 * external API call.  Checked in priority order:
 *  1. JSON-LD GeoCoordinates (`geo.latitude` / `geo.longitude`)
 *  2. `<meta name="geo.position" content="lat;lng">`
 *  3. Open Graph place tags (`place:location:latitude` / `place:location:longitude`)
 *  4. Google Maps iframe embed URL (`@lat,lng` or `q=lat,lng` patterns)
 *  5. Inline `data-lat` / `data-lng` attributes anywhere in the page
 */
function extractCoordinatesFromHtml(html: string): { lat: number; lng: number } | null {
  // 1. JSON-LD
  for (const match of html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const data = JSON.parse(match[1]) as Record<string, unknown>
      // Support top-level and nested location.geo
      const geoRaw = (data.geo ?? (data.location as Record<string, unknown> | undefined)?.geo) as
        | Record<string, unknown>
        | undefined
      if (geoRaw) {
        const lat = parseFloat(geoRaw.latitude as string)
        const lng = parseFloat(geoRaw.longitude as string)
        if (!isNaN(lat) && !isNaN(lng)) return { lat, lng }
      }
    } catch { /* malformed JSON-LD — skip */ }
  }

  // 2. <meta name="geo.position" content="lat;lng">
  const metaGeoPos = html.match(/<meta[^>]+name="geo\.position"[^>]+content="([^"]+)"/i)
  if (metaGeoPos) {
    const [lat, lng] = metaGeoPos[1].split(';').map(parseFloat)
    if (!isNaN(lat) && !isNaN(lng)) return { lat, lng }
  }

  // 3. Open Graph place tags
  const ogLat = html.match(/<meta[^>]+property="place:location:latitude"[^>]+content="([^"]+)"/i)
  const ogLng = html.match(/<meta[^>]+property="place:location:longitude"[^>]+content="([^"]+)"/i)
  if (ogLat && ogLng) {
    const lat = parseFloat(ogLat[1])
    const lng = parseFloat(ogLng[1])
    if (!isNaN(lat) && !isNaN(lng)) return { lat, lng }
  }

  // 4. Google Maps iframe embed (handles both embed and regular map URLs)
  const iframeMatch = html.match(/<iframe[^>]+src="([^"]*(?:google\.com\/maps|maps\.google\.com)[^"]*)"[^>]*>/i)
  if (iframeMatch) {
    const src = decodeURIComponent(iframeMatch[1])
    const atMatch = src.match(/@(-?\d+\.?\d+),(-?\d+\.?\d+)/)
    if (atMatch) return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) }
    const qMatch = src.match(/[?&]q=(-?\d+\.?\d+),(-?\d+\.?\d+)/)
    if (qMatch) return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) }
  }

  // 5. data-lat / data-lng / data-latitude / data-longitude attributes
  const dataLat = html.match(/data-la(?:t|titude)="(-?\d+\.?\d+)"/i)
  const dataLng = html.match(/data-lo(?:n|ng|ngitude)="(-?\d+\.?\d+)"/i)
  if (dataLat && dataLng) {
    const lat = parseFloat(dataLat[1])
    const lng = parseFloat(dataLng[1])
    if (!isNaN(lat) && !isNaN(lng)) return { lat, lng }
  }

  return null
}

/**
 * Fetches a URL and returns:
 *  - clean plain text for LLM extraction
 *  - a deduplicated list of candidate image URLs found on the page
 */
export async function scrapeText(url: string): Promise<ScrapeResult> {
  const response = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (compatible; EventScraper/1.0; +https://github.com/dtl-cultural)',
      'Accept-Language': 'es,ca;q=0.9,en;q=0.8',
    },
    redirect: 'follow',
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} fetching ${url}`)
  }

  const html = await response.text()
  const $ = cheerio.load(html)

  // Resolve relative URLs against the page origin
  const parsedUrl = new URL(response.url ?? url)
  const baseUrl = parsedUrl.origin

  // ── Collect candidate image URLs before stripping the DOM ──────────────

  /**
   * Resolves a potentially-relative src value to an absolute URL.
   * Returns null for empty/unparseable values.
   */
  function resolveUrl(src: string | undefined): string | null {
    if (!src?.trim()) return null
    try { return new URL(src.trim(), baseUrl).href } catch { return null }
  }

  /** Return true for URLs that are clearly not event poster images. */
  function isNoise(abs: string): boolean {
    // data: URIs are always placeholders (transparent GIF, etc.)
    if (abs.startsWith('data:')) return true
    return (
      abs.endsWith('.svg') ||
      /logo|icon|avatar|sprite|pixel|tracking|1x1|banner-cookie|captcha/i.test(abs)
    )
  }

  /**
   * Walk up the ancestor chain from `el` and return the text of the first
   * element whose trimmed text fits within [minLen, maxLen] chars — this
   * is usually the event-card container.  Falls back to empty string.
   */
  function nearestContainerText(el: cheerio.AnyNode): string {
    let current = el.type === 'tag' ? (el as cheerio.Element).parent : null
    for (let i = 0; i < 7 && current && current.type === 'tag'; i++) {
      const t = $(current as cheerio.Element).text().replace(/\s+/g, ' ').trim()
      if (t.length >= 20 && t.length <= 500) return t.slice(0, 200)
      current = (current as cheerio.Element).parent
    }
    return ''
  }

  const seen = new Set<string>()
  const imageCandidates: ImageCandidate[] = []

  // 1. <img> elements — cover every common lazy-load attribute.
  // Lazy-load attrs are checked BEFORE src because src is often a tiny
  // data-URI placeholder when lazy loading is in use.
  const lazyAttrs = [
    'data-src', 'data-lazy', 'data-lazy-src', 'data-original',
    'data-image', 'data-img', 'data-url', 'data-full',
    'src', // checked last — may be a placeholder data: URI
  ]
  $('img').each((_, el) => {
    let url: string | null = null
    for (const attr of lazyAttrs) {
      const candidate = resolveUrl($(el).attr(attr))
      if (candidate && !isNoise(candidate)) { url = candidate; break }
    }
    // Also try srcset / data-srcset on <img> (pick highest-res entry)
    if (!url) {
      const rawSrcset = $(el).attr('srcset') || $(el).attr('data-srcset') || ''
      if (rawSrcset) {
        const entries = rawSrcset.split(',').map(s => s.trim().split(/\s+/)[0])
        for (const candidate of entries.reverse()) {
          const resolved = resolveUrl(candidate)
          if (resolved && !isNoise(resolved)) { url = resolved; break }
        }
      }
    }
    if (!url || seen.has(url)) return
    seen.add(url)
    const alt = ($(el).attr('alt') || $(el).attr('title') || $(el).attr('aria-label') || '').trim()
    imageCandidates.push({ url, alt, containerText: nearestContainerText(el) })
  })

  // 2. <source> elements inside <picture> (srcset / data-srcset)
  $('source[srcset], source[data-srcset]').each((_, el) => {
    const rawSrcset = $(el).attr('srcset') || $(el).attr('data-srcset') || ''
    // srcset can be "url1 1x, url2 2x" — take the last (highest-res) candidate
    const candidates = rawSrcset.split(',').map(s => s.trim().split(/\s+/)[0])
    for (const candidate of candidates.reverse()) {
      const url = resolveUrl(candidate)
      if (!url || seen.has(url) || isNoise(url)) continue
      seen.add(url)
      imageCandidates.push({ url, alt: '', containerText: nearestContainerText(el) })
      break  // one per <source> element is enough
    }
  })

  // 3. Inline background-image styles on any element
  $('[style*="background"]').each((_, el) => {
    const style = $(el).attr('style') || ''
    const match = style.match(/background(?:-image)?\s*:\s*url\(\s*['"]?([^'")]+)['"]?\s*\)/i)
    if (!match) return
    const url = resolveUrl(match[1])
    if (!url || seen.has(url) || isNoise(url)) return
    seen.add(url)
    const alt = ($(el).attr('aria-label') || $(el).attr('title') || '').trim()
    imageCandidates.push({ url, alt, containerText: nearestContainerText(el) })
  })

  // 4. data-bg / data-background / data-lazy-background attributes on any element
  $('[data-bg], [data-background], [data-lazy-background]').each((_, el) => {
    const raw = $(el).attr('data-bg') || $(el).attr('data-background') || $(el).attr('data-lazy-background') || ''
    const url = resolveUrl(raw)
    if (!url || seen.has(url) || isNoise(url)) return
    seen.add(url)
    imageCandidates.push({ url, alt: '', containerText: nearestContainerText(el) })
  })

  const imageUrls = imageCandidates.map(c => c.url)

  // ── Extract clean text ──────────────────────────────────────────────────
  $(
    'script, style, noscript, nav, header, footer, aside, ' +
      '[role="banner"], [role="navigation"], [role="contentinfo"], ' +
      '.cookie-banner, .cookie-notice, #cookie-banner, ' +
      '.breadcrumb, .pagination, .sidebar',
  ).remove()

  const raw = $('body').text()
  const cleaned = raw
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  const text =
    cleaned.length > MAX_CHARS
      ? cleaned.slice(0, MAX_CHARS) + '\n[... content truncated ...]'
      : cleaned

  const coordinates = extractCoordinatesFromHtml(html)

  return { text, imageUrls, imageCandidates, baseUrl, coordinates }
}

/**
 * Fetches a URL and returns the value of its `og:image` meta tag, or null.
 * Used as a per-event fallback when the listing page didn't yield a poster.
 * Times out after 8 seconds so it never blocks the main pipeline for long.
 */
export async function fetchOgImage(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; EventScraper/1.0; +https://github.com/dtl-cultural)',
        'Accept-Language': 'es,ca;q=0.9,en;q=0.8',
      },
      signal: AbortSignal.timeout(8_000),
      redirect: 'follow',
    })
    if (!response.ok) return null
    const html = await response.text()
    // og:image content attr can appear before or after property attr
    const match =
      html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ??
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)
    if (match) return match[1].trim()
    // Fallback: twitter:image
    const tw =
      html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i) ??
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i)
    return tw ? tw[1].trim() : null
  } catch {
    return null
  }
}
