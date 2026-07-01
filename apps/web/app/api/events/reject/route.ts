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
  const rejectionReason = formData.get('rejection_reason') as string

  if (!rejectionReason?.trim()) {
    return NextResponse.json({ error: 'rejection_reason is required' }, { status: 400 })
  }

  const admin = getAdminClient()
  const { error } = await admin
    .from('events')
    .update({ status: 'rejected', rejection_reason: rejectionReason })
    .eq('id', eventId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.redirect(new URL('/admin/events', request.url), 303)
}
