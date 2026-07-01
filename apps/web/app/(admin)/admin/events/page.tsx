import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'
import type { EventWithOrganizer } from '@dtl-cultural/shared'

const PAGE_SIZE = 25

interface Props {
  searchParams: Promise<{ page?: string }>
}

export default async function AdminEventsPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams
  const page = Math.max(1, parseInt(pageParam ?? '1', 10))
  const offset = (page - 1) * PAGE_SIZE

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Verify admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/dashboard')

  const { data: events, count } = await supabase
    .from('events')
    .select('*, profiles(organization_name, email), cities(name, slug)', { count: 'exact' })
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
    .range(offset, offset + PAGE_SIZE - 1)

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)

  return (
    <div className="min-h-screen bg-[#1e2640] text-white">
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Logo variant="light" size="sm" />
          <span className="text-xs text-white/40 font-medium uppercase tracking-widest">Admin</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-playfair)' }}>Eventos pendientes</h1>
          <span className="bg-amber-400/10 text-amber-400 border border-amber-400/20 text-sm font-medium px-2.5 py-0.5 rounded-full">
            {count ?? 0}
          </span>
        </div>

        <nav className="flex gap-1 mb-8">
          {[
            { href: '/admin', label: 'Resumen' },
            { href: '/admin/events', label: 'Eventos', active: true },
            { href: '/admin/users', label: 'Usuarios' },
            { href: '/admin/cities', label: 'Ciudades' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                item.active ? 'text-white' : 'text-white/40 hover:text-white/70'
              }`}
              style={item.active ? { background: 'linear-gradient(135deg, #f4921e, #2bc4b3)' } : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {!events || events.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 py-20 text-center">
            <p className="text-white/40 text-lg">No hay eventos pendientes de revisión.</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {events.map((event: any) => (
                <AdminEventCard key={event.id} event={event} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-8">
                <p className="text-sm text-white/40">Página {page} de {totalPages}</p>
                <div className="flex gap-2">
                  {page > 1 && (
                    <Link
                      href={`/admin/events?page=${page - 1}`}
                      className="px-4 py-2 text-sm border border-white/10 rounded-xl text-white/70 hover:bg-white/5 transition"
                    >
                      ← Anterior
                    </Link>
                  )}
                  {page < totalPages && (
                    <Link
                      href={`/admin/events?page=${page + 1}`}
                      className="px-4 py-2 text-sm rounded-xl text-white font-semibold transition hover:opacity-90"
                      style={{ background: 'linear-gradient(135deg, #f4921e, #2bc4b3)' }}
                    >
                      Siguiente →
                    </Link>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

function AdminEventCard({ event }: { event: any }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5 hover:bg-white/[0.08] transition">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h2 className="font-semibold text-white">{event.title}</h2>
            <span className="text-xs bg-white/5 border border-white/10 text-white/50 px-2 py-0.5 rounded-full capitalize">
              {event.category}
            </span>
            <span className="text-xs text-white/40">{event.cities?.name}</span>
          </div>
          <p className="text-sm text-white/50 mb-2">
            Por <strong className="text-white/80">{event.profiles?.organization_name}</strong> ({event.profiles?.email}) ·{' '}
            {event.start_date}{event.end_date ? ` → ${event.end_date}` : ''}
          </p>
          <p className="text-sm text-white/60 line-clamp-2">{event.description}</p>
          <p className="text-sm text-white/40 mt-1">
            {event.location_text}
            {event.price != null ? ` · €${event.price}` : ' · Gratuito'}
          </p>
          {event.website && (
            <a
              href={event.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-amber-400 hover:text-amber-300 mt-1 inline-block transition"
            >
              {event.website}
            </a>
          )}
          {event.poster_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={event.poster_url}
              alt="Cartel del evento"
              className="mt-2 h-24 rounded-lg object-cover border border-white/10"
            />
          )}
        </div>

        <div className="flex flex-col gap-2 shrink-0">
          <form action="/api/events/approve" method="POST">
            <input type="hidden" name="event_id" value={event.id} />
            <button
              type="submit"
              className="w-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl px-4 py-2 text-sm font-semibold hover:bg-emerald-500/20 transition"
            >
              Aprobar
            </button>
          </form>
          <RejectForm eventId={event.id} />
        </div>
      </div>
    </div>
  )
}

function RejectForm({ eventId }: { eventId: string }) {
  return (
    <form action="/api/events/reject" method="POST" className="flex flex-col gap-1">
      <input type="hidden" name="event_id" value={eventId} />
      <textarea
        name="rejection_reason"
        required
        rows={2}
        placeholder="Motivo del rechazo..."
        className="text-xs bg-white/5 border border-white/10 text-white placeholder-white/20 rounded-xl px-2 py-1 resize-none focus:outline-none focus:ring-1 focus:ring-red-400 w-36"
      />
      <button
        type="submit"
        className="bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl px-4 py-2 text-sm font-semibold hover:bg-red-500/20 transition"
      >
        Rechazar
      </button>
    </form>
  )
}
