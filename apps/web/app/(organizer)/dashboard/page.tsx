import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LogoutButton } from '@/components/ui/LogoutButton'
import { Logo } from '@/components/ui/Logo'
import type { Event, Profile, City } from '@dtl-cultural/shared'

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  pending: { label: 'Pendiente', className: 'bg-amber-400/10 text-amber-400 border border-amber-400/20' },
  approved: { label: 'Aprobado', className: 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20' },
  rejected: { label: 'Rechazado', className: 'bg-red-400/10 text-red-400 border border-red-400/20' },
}

const CATEGORY_LABELS: Record<string, string> = {
  music: 'Música',
  theatre: 'Teatro',
  food: 'Gastronomía',
  other: 'Otros',
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, cities(name)')
    .eq('id', user.id)
    .single<Profile & { cities: Pick<City, 'name'> }>()

  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('organizer_id', user.id)
    .order('created_at', { ascending: false })

  const postsLimit =
    profile?.subscription_tier === 'premium'
      ? 100
      : profile?.subscription_tier === 'basic'
        ? 10
        : 1

  const usedPct = Math.min(100, ((profile?.posts_used_this_month ?? 0) / postsLimit) * 100)

  return (
    <div className="min-h-screen bg-[#1e2640] text-white">
      {/* Top nav */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Logo variant="light" size="sm" />
          <div className="flex items-center gap-3">
            {profile?.role === 'admin' && (
              <Link
                href="/admin"
                className="rounded-xl px-4 py-2 text-sm font-semibold text-white/60 border border-white/15 hover:text-white hover:border-white/30 transition"
              >
                Admin
              </Link>
            )}
            <Link
              href="/events/new"
              className="rounded-xl px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #f4921e, #2bc4b3)' }}
            >
              + Nuevo evento
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-playfair)' }}>
            {profile?.organization_name ?? 'Mi panel'}
          </h1>
          <p className="text-sm text-white/50 mt-1">
            Plan <span className="text-white/80 font-medium capitalize">{profile?.subscription_tier ?? 'free'}</span>
            {' · '}{profile?.posts_used_this_month ?? 0} de {postsLimit} publicaciones este mes
          </p>
          {/* Usage bar */}
          <div className="mt-3 h-1.5 w-64 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: `${usedPct}%`,
                background: 'linear-gradient(90deg, #f4921e, #2bc4b3)',
              }}
            />
          </div>
        </div>

        {/* Upgrade banner */}
        {profile?.subscription_tier === 'free' && (
          <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 px-5 py-4 flex items-center justify-between">
            <p className="text-sm text-amber-300">
              Estás en el plan gratuito. Actualiza para publicar más eventos.
            </p>
            <Link
              href="/subscription"
              className="text-sm font-semibold text-amber-400 hover:text-amber-300 transition"
            >
              Ver planes →
            </Link>
          </div>
        )}

        {/* Events list */}
        {!events || events.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 py-20 text-center">
            <p className="text-white/40 text-lg">Aún no has publicado ningún evento.</p>
            <Link
              href="/events/new"
              className="mt-4 inline-block text-sm font-semibold text-amber-400 hover:text-amber-300 transition"
            >
              Publica tu primer evento →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {(events as Event[]).map((event) => {
              const status = STATUS_LABELS[event.status] ?? STATUS_LABELS['pending']!
              return (
                <div
                  key={event.id}
                  className="rounded-xl border border-white/10 bg-white/5 px-5 py-4 flex items-start justify-between hover:bg-white/8 transition"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-semibold text-white truncate">{event.title}</h2>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${status.className}`}>
                        {status.label}
                      </span>
                      <span className="text-xs text-white/40 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                        {CATEGORY_LABELS[event.category]}
                      </span>
                    </div>
                    <p className="text-sm text-white/40 mt-1">
                      {event.start_date}
                      {event.end_date ? ` → ${event.end_date}` : ''} · {event.location_text}
                    </p>
                    {event.status === 'rejected' && event.rejection_reason && (
                      <p className="text-sm text-red-400 mt-1">
                        Rechazado: {event.rejection_reason}
                      </p>
                    )}
                  </div>
                  {event.status === 'pending' && (
                    <Link
                      href={`/events/${event.id}/edit`}
                      className="ml-4 text-sm font-medium text-amber-400 hover:text-amber-300 transition shrink-0"
                    >
                      Editar
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

