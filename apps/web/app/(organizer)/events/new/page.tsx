import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { EventForm } from '@/components/events/EventForm'
import { Logo } from '@/components/ui/Logo'
import Link from 'next/link'
import type { Profile, OrganizerLocation } from '@dtl-cultural/shared'

export default async function NewEventPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, city_id, subscription_tier, posts_used_this_month')
    .eq('id', user.id)
    .single<Pick<Profile, 'id' | 'city_id' | 'subscription_tier' | 'posts_used_this_month'>>()

  if (!profile) redirect('/login')

  const { data: savedLocations } = await supabase
    .from('organizer_locations')
    .select('*')
    .eq('organizer_id', user.id)
    .order('created_at', { ascending: true })

  return (
    <div className="min-h-screen bg-[#1e2640] text-white">
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Logo variant="light" size="sm" />
          <Link href="/dashboard" className="text-sm text-white/50 hover:text-white/80 transition">← Volver</Link>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-8" style={{ fontFamily: 'var(--font-playfair)' }}>Nuevo evento</h1>
        <EventForm
          organizerId={profile.id}
          cityId={profile.city_id}
          savedLocations={(savedLocations ?? []) as OrganizerLocation[]}
        />
      </main>
    </div>
  )
}
