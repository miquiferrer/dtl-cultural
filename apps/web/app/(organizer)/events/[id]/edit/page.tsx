import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { EventForm } from '@/components/events/EventForm'
import { Logo } from '@/components/ui/Logo'
import Link from 'next/link'
import type { Event, Profile, OrganizerLocation } from '@dtl-cultural/shared'

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditEventPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const [{ data: event }, { data: profile }, { data: savedLocations }] = await Promise.all([
    supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .eq('organizer_id', user.id)
      .eq('status', 'pending')
      .single<Event>(),
    supabase
      .from('profiles')
      .select('id, city_id')
      .eq('id', user.id)
      .single<Pick<Profile, 'id' | 'city_id'>>(),
    supabase
      .from('organizer_locations')
      .select('*')
      .eq('organizer_id', user.id)
      .order('created_at', { ascending: true }),
  ])

  if (!event || !profile) notFound()

  return (
    <div className="min-h-screen bg-[#1e2640] text-white">
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Logo variant="light" size="sm" />
          <Link href="/dashboard" className="text-sm text-white/50 hover:text-white/80 transition">← Volver</Link>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-8" style={{ fontFamily: 'var(--font-playfair)' }}>Editar evento</h1>
        <EventForm
          event={event}
          organizerId={profile.id}
          cityId={profile.city_id}
          savedLocations={(savedLocations ?? []) as OrganizerLocation[]}
        />
      </main>
    </div>
  )
}
