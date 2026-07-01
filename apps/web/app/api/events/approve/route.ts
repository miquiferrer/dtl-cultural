import { NextRequest, NextResponse } from 'next/server'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/server'

function getAdminClient() {
  return createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const formData = await request.formData()
  const eventId = formData.get('event_id') as string
  const srvKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  try {
    const payload = JSON.parse(Buffer.from(srvKey.split('.')[1], 'base64').toString())
    console.log('key JWT role:', payload.role)
  } catch { console.log('failed to decode key') }

  const admin = getAdminClient()

  // First verify the event exists
  const { data: existing, error: fetchError } = await admin
    .from('events')
    .select('id, status')
    .eq('id', eventId)
    .single()
  console.log('existing event:', existing, 'fetchError:', fetchError)

  const { data: event, error } = await admin
    .from('events')
    .update({ status: 'approved', rejection_reason: null })
    .eq('id', eventId)
    .select('id')
    .single()

  if (error) {
    console.error('approve error:', JSON.stringify(error))
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const fnHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
  }
  const fnBody = JSON.stringify({ event_id: event.id })
  const fnBase = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1`

  // Trigger push notification (non-fatal)
  try {
    const pushRes = await fetch(`${fnBase}/send-push`, { method: 'POST', headers: fnHeaders, body: fnBody })
    if (!pushRes.ok) {
      const text = await pushRes.text()
      console.warn(`send-push returned ${pushRes.status}:`, text)
    }
  } catch (pushErr) {
    console.warn('send-push network error:', pushErr)
  }

  // Trigger email alerts for subscribed users (non-fatal)
  try {
    const alertRes = await fetch(`${fnBase}/send-event-alerts`, { method: 'POST', headers: fnHeaders, body: fnBody })
    const alertBody = await alertRes.text()
    if (!alertRes.ok) {
      console.warn(`send-event-alerts returned ${alertRes.status}:`, alertBody)
    } else {
      console.log('send-event-alerts result:', alertBody)
    }
  } catch (alertErr) {
    console.warn('send-event-alerts network error:', alertErr)
  }

  return NextResponse.redirect(new URL('/admin/events', request.url), 303)
}
