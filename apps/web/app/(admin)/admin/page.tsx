import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'
import { LogoutButton } from '@/components/ui/LogoutButton'

const TIER_BADGE: Record<string, string> = {
  free: 'bg-white/5 text-white/40 border border-white/10',
  basic: 'bg-amber-400/10 text-amber-400 border border-amber-400/20',
  premium: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
}

export default async function AdminOverviewPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/dashboard')

  // ── Parallel data fetching ────────────────────────────────────────────────
  const [
    { count: totalUsers },
    { count: totalEvents },
    { count: pendingEvents },
    { count: approvedEvents },
    { data: tierCounts },
    { data: cityStats },
    { data: recentUsers },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('events').select('*', { count: 'exact', head: true }),
    supabase.from('events').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('events').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
    // Subscription breakdown
    supabase
      .from('profiles')
      .select('subscription_tier')
      .then(({ data }) => ({
        data: data?.reduce(
          (acc, p) => {
            acc[p.subscription_tier] = (acc[p.subscription_tier] ?? 0) + 1
            return acc
          },
          {} as Record<string, number>,
        ),
      })),
    // Events + users per city
    supabase
      .from('cities')
      .select('id, name, profiles(count), events(count)')
      .order('name'),
    // Recent signups
    supabase
      .from('profiles')
      .select('id, organization_name, email, subscription_tier, created_at, cities(name)')
      .order('created_at', { ascending: false })
      .limit(8),
  ])

  const free = (tierCounts as any)?.free ?? 0
  const basic = (tierCounts as any)?.basic ?? 0
  const premium = (tierCounts as any)?.premium ?? 0

  return (
    <div className="min-h-screen bg-[#1e2640] text-white">
      {/* Top nav */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Logo variant="light" size="sm" />
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/40 font-medium uppercase tracking-widest">Admin</span>
            <Link
              href="/dashboard"
              className="text-sm text-white/50 hover:text-white transition"
            >
              Dashboard
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-8" style={{ fontFamily: 'var(--font-playfair)' }}>
          Panel de administración
        </h1>

        {/* Nav tabs */}
        <nav className="flex gap-1 mb-8">
          {[
            { href: '/admin', label: 'Resumen', active: true },
            { href: '/admin/events', label: 'Eventos' },
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

        {/* KPI cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <KpiCard label="Organizaciones" value={totalUsers ?? 0} icon="🏢" />
          <KpiCard
            label="Eventos publicados"
            value={approvedEvents ?? 0}
            icon="✅"
            sub={`${pendingEvents ?? 0} pendientes`}
            subColor="text-amber-400"
          />
          <KpiCard label="Total eventos" value={totalEvents ?? 0} icon="📅" />
          <KpiCard
            label="Suscriptores de pago"
            value={basic + premium}
            icon="💳"
            sub={`${free} en plan gratuito`}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Subscription breakdown */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <h2 className="font-semibold text-white mb-4">Suscripciones</h2>
            <div className="space-y-3">
              {[
                { tier: 'premium', label: 'Premium', count: premium, color: '#2bc4b3' },
                { tier: 'basic', label: 'Básico', count: basic, color: '#f4921e' },
                { tier: 'free', label: 'Gratuito', count: free, color: 'rgba(255,255,255,0.2)' },
              ].map(({ tier, label, count, color }) => (
                <div key={tier} className="flex items-center gap-3">
                  <span className="w-20 text-sm font-medium text-white/70">{label}</span>
                  <div className="flex-1 bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-1.5 rounded-full"
                      style={{
                        width: `${totalUsers ? (count / totalUsers) * 100 : 0}%`,
                        background: color,
                      }}
                    />
                  </div>
                  <span className="text-sm text-white/40 w-8 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Per-city stats */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <h2 className="font-semibold text-white mb-4">Por ciudad</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-white/40 uppercase">
                  <th className="text-left pb-2">Ciudad</th>
                  <th className="text-right pb-2">Org.</th>
                  <th className="text-right pb-2">Eventos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {(cityStats ?? []).map((city: any) => (
                  <tr key={city.id}>
                    <td className="py-2 font-medium text-white">{city.name}</td>
                    <td className="py-2 text-right text-white/40">{city.profiles?.[0]?.count ?? 0}</td>
                    <td className="py-2 text-right text-white/40">{city.events?.[0]?.count ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent signups */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-white">Últimos registros</h2>
            <Link href="/admin/users" className="text-xs text-amber-400 hover:text-amber-300 transition">
              Ver todos →
            </Link>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-white/40 uppercase">
                <th className="text-left pb-2">Organización</th>
                <th className="text-left pb-2">Email</th>
                <th className="text-left pb-2">Ciudad</th>
                <th className="text-left pb-2">Plan</th>
                <th className="text-right pb-2">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {(recentUsers ?? []).map((u: any) => (
                <tr key={u.id} className="hover:bg-white/5 transition">
                  <td className="py-2 font-medium text-white">{u.organization_name ?? '—'}</td>
                  <td className="py-2 text-white/50">{u.email}</td>
                  <td className="py-2 text-white/50">{u.cities?.name ?? '—'}</td>
                  <td className="py-2">
                    <span className={`capitalize font-medium text-xs px-2 py-0.5 rounded-full ${TIER_BADGE[u.subscription_tier] ?? TIER_BADGE.free}`}>
                      {u.subscription_tier}
                    </span>
                  </td>
                  <td className="py-2 text-right text-white/30 text-xs">
                    {new Date(u.created_at).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

function KpiCard({
  label,
  value,
  icon,
  sub,
  subColor = 'text-white/40',
}: {
  label: string
  value: number
  icon: string
  sub?: string
  subColor?: string
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">{icon}</span>
        <span className="text-xs text-white/40 font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
      {sub && <p className={`text-xs mt-1 ${subColor}`}>{sub}</p>}
    </div>
  )
}
