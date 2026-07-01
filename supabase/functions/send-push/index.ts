// Supabase Edge Function: send-push
// Called internally when an event is approved.
// Sends an Expo push notification to all devices registered for the event's city.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send'

interface SendPushPayload {
  event_id: string
}

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  let payload: SendPushPayload
  try {
    payload = await req.json()
  } catch {
    return new Response('Invalid JSON body', { status: 400 })
  }

  // Fetch the event details
  const { data: event, error: eventError } = await supabase
    .from('events')
    .select('id, title, category, start_date, cities(slug)')
    .eq('id', payload.event_id)
    .single()

  if (eventError || !event) {
    return new Response('Event not found', { status: 404 })
  }

  const citySlug = (event as any).cities?.slug as string
  if (!citySlug) {
    return new Response('City not found for event', { status: 400 })
  }

  // Fetch all push tokens for this city
  const { data: tokens, error: tokensError } = await supabase
    .from('push_tokens')
    .select('device_token')
    .eq('city_slug', citySlug)

  if (tokensError) {
    console.error('Error fetching push tokens:', tokensError)
    return new Response('Failed to fetch tokens', { status: 500 })
  }

  if (!tokens || tokens.length === 0) {
    return new Response(JSON.stringify({ sent: 0 }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Build Expo push messages (batch of up to 100)
  const messages = tokens.map((t: { device_token: string }) => ({
    to: t.device_token,
    sound: 'default',
    title: '¡Nuevo evento!',
    body: event.title,
    data: { event_id: event.id },
  }))

  // Send in chunks of 100 (Expo limit)
  const chunkSize = 100
  let totalSent = 0

  for (let i = 0; i < messages.length; i += chunkSize) {
    const chunk = messages.slice(i, i + chunkSize)
    const response = await fetch(EXPO_PUSH_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(chunk),
    })

    if (!response.ok) {
      console.error('Expo push error:', await response.text())
    } else {
      totalSent += chunk.length
    }
  }

  return new Response(JSON.stringify({ sent: totalSent }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
