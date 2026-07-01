import { GoogleGenAI, Type } from '@google/genai'
import type { EventRow, VenueInfo } from './types.js'
import type { ImageCandidate } from './scraper.js'

export interface ExtractionResult {
  venue: VenueInfo
  events: EventRow[]
}

const EXTRACTION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    venue: {
      type: Type.OBJECT,
      description:
        'The single venue or organisation that hosts all events on this page',
      properties: {
        name: {
          type: Type.STRING,
          description: 'Name of the venue, cultural centre, or organisation',
        },
        address: {
          type: Type.STRING,
          description:
            'Full street address including city and postcode, or empty string if not found',
        },
      },
      required: ['name', 'address'],
    },
    events: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: {
            type: Type.STRING,
            description: 'Full title of the event',
          },
          description: {
            type: Type.STRING,
            description: 'Short description or summary of the event',
          },
          category: {
            type: Type.STRING,
            enum: ['music', 'theatre', 'food', 'other'],
            description:
              'music=concerts/festivals, theatre=dance/performance/cinema, food=gastronomy/markets, other=exhibitions/talks/workshops',
          },
          start_date: {
            type: Type.STRING,
            description: 'Start date in YYYY-MM-DD format',
          },
          end_date: {
            type: Type.STRING,
            description:
              'End date in YYYY-MM-DD format, or empty string if same as start or unknown',
          },
          price: {
            type: Type.STRING,
            description:
              'Ticket price as a numeric string e.g. "5.00", or empty string if free or unknown',
          },
          website: {
            type: Type.STRING,
            description: 'Full URL for more information, or empty string',
          },
          poster_url: {
            type: Type.STRING,
            description:
              'Full URL of the best matching event image from the provided image list, or empty string. Must be one of the provided URLs or empty.',
          },
        },
        required: ['title', 'start_date', 'category'],
      },
    },
  },
  required: ['venue', 'events'],
}

function buildPrompt(text: string, sourceUrl: string, imageCandidates: ImageCandidate[]): string {
  const currentYear = new Date().getFullYear()

  let imageSection = ''
  if (imageCandidates.length > 0) {
    const lines = imageCandidates.slice(0, 60).map((c, i) => {
      const parts: string[] = [`${i + 1}. ${c.url}`]
      if (c.alt) parts.push(`alt="${c.alt}"`)
      if (c.containerText) parts.push(`context: ${c.containerText}`)
      return parts.join(' | ')
    })
    imageSection =
      `\n--- AVAILABLE IMAGES ---\n` +
      `Each line: index. URL | alt="..." | context: <text from the surrounding card>\n` +
      `Use the alt text and context to match each image to the correct event.\n` +
      lines.join('\n') + '\n'
  }

  return (
    `Extract all cultural events and the hosting venue from this webpage.\n` +
    `Source URL: ${sourceUrl}\n` +
    `Current year: ${currentYear} — use this to resolve partial dates (e.g. "15 de juny" → "${currentYear}-06-15").\n` +
    `Only include real upcoming or current events, not past ones if the date is clearly in the past.\n` +
    `For poster_url: use the URL from the image list whose alt text or context best matches the event title. ` +
    `Every event that has a matching image MUST have a poster_url. Use empty string only when truly no image matches.\n` +
    `If a field is unknown or not present, use an empty string.\n` +
    imageSection +
    `\n--- WEBPAGE CONTENT ---\n${text}`
  )
}

export async function extractEvents(
  text: string,
  sourceUrl: string,
  imageCandidates: ImageCandidate[],
  apiKey: string,
  model: string,
): Promise<ExtractionResult> {
  const ai = new GoogleGenAI({ apiKey })

  const response = await ai.models.generateContent({
    model,
    contents: buildPrompt(text, sourceUrl, imageCandidates),
    config: {
      responseMimeType: 'application/json',
      responseSchema: EXTRACTION_SCHEMA,
    },
  })

  const raw = response.text
  if (!raw) {
    throw new Error('Gemini returned an empty response.')
  }

  let parsed: { venue: VenueInfo; events: Partial<EventRow>[] }
  try {
    parsed = JSON.parse(raw) as { venue: VenueInfo; events: Partial<EventRow>[] }
  } catch {
    throw new Error(`Failed to parse Gemini JSON response:\n${raw}`)
  }

  const venue: VenueInfo = {
    name: String(parsed.venue?.name ?? '').trim(),
    address: String(parsed.venue?.address ?? '').trim(),
  }

  const events: EventRow[] = (parsed.events ?? []).map((e) => ({
    title: String(e.title ?? '').trim(),
    description: String(e.description ?? '').trim(),
    category: (['music', 'theatre', 'food', 'other'] as const).includes(
      e.category as EventRow['category'],
    )
      ? (e.category as EventRow['category'])
      : 'other',
    start_date: String(e.start_date ?? '').trim(),
    end_date: String(e.end_date ?? '').trim(),
    location_text: '',  // filled in index.ts from venue
    latitude: '',       // filled in index.ts after geocoding
    longitude: '',      // filled in index.ts after geocoding
    price: String(e.price ?? '').trim(),
    website: String(e.website ?? '').trim(),
    poster_url: String(e.poster_url ?? '').trim(),
  }))

  return { venue, events }
}
