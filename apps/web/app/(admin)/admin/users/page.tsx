import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'

const TIER_BADGE: Record<string, string> = {
  free: 'bg-white/5 text-white/40 border border-white/10',
  basic: 'bg-amber-400/10 text-amber-400 border border-amber-400/20',
  premium: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
}

export default async function AdminUsersPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (profile?.role !== 'admin') redirect('/dashboard')

  const { data: users } = await supabase
    .from('profiles')
    .select('id, email, organization_name, subscription_tier, posts_used_this_month, cities(name), created_at')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-[#1e2640] text-white">
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Logo variant="light" size="sm" />
          <span className="text-xs text-white/40 font-medium uppercase tracking-widest">Admin</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-8" style={{ fontFamily: 'var(--font-playfair)' }}>Usuarios</h1>

        <nav className="flex gap-1 mb-8">
          {[
            { href: '/admin', label: 'Resumen' },
            { href: '/admin/events', label: 'Eventos' },
            { href: '/admin/users', label: 'Usuarios', active: true },
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

        <div className="rounded-2xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-4 py-3 text-left text-xs text-white/40 uppercase tracking-wide font-medium">Organización</th>
                <th className="px-4 py-3 text-left text-xs text-white/40 uppercase tracking-wide font-medium">Email</th>
                <th className="px-4 py-3 text-left text-xs text-white/40 uppercase tracking-wide font-medium">Ciudad</th>
                <th className="px-4 py-3 text-left text-xs text-white/40 uppercase tracking-wide font-medium">Plan</th>
                <th className="px-4 py-3 text-right text-xs text-white/40 uppercase tracking-wide font-medium">Posts este mes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {(users ?? []).map((u: any) => (
                <tr key={u.id} className="hover:bg-white/5 transition">
                  <td className="px-4 py-3 font-medium text-white">{u.organization_name}</td>
                  <td className="px-4 py-3 text-white/50">{u.email}</td>
                  <td className="px-4 py-3 text-white/50">{u.cities?.name ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${TIER_BADGE[u.subscription_tier] ?? TIER_BADGE.free}`}>
                      {u.subscription_tier}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-white/50">{u.posts_used_this_month}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
