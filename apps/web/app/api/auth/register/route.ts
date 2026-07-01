import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

interface LocationInput {
  label: string
  location_text: string
  lat: number
  lng: number
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { email, password, organization_name, locations } = body as {
    email?: string
    password?: string
    organization_name?: string
    locations?: LocationInput[]
  }

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    user_metadata: { organization_name: organization_name ?? '' },
    email_confirm: true,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  // Insert saved locations (trigger has already created the profile row)
  if (locations && locations.length > 0) {
    const { error: locError } = await supabase.from('organizer_locations').insert(
      locations.map((l) => ({
        organizer_id: data.user.id,
        label: l.label,
        location_text: l.location_text,
        latitude: l.lat,
        longitude: l.lng,
      })),
    )
    if (locError) {
      console.error('Failed to insert organizer locations:', locError.message)
      // Not fatal — organizer can add locations later from their dashboard
    }
  }

  return NextResponse.json({ user: data.user })
}

