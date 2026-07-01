import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CitiesManager } from '@/components/organizer/CitiesManager'
import { Logo } from '@/components/ui/Logo'
import type { City } from '@dtl-cultural/shared'

export default async function AdminCitiesPage() {
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

  const { data: cities } = await supabase
    .from('cities')
    .select('*')
    .order('name')

  return (
    <div className="min-h-screen bg-[#1e2640] text-white">
      <header className="border-b border-white/10 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Logo variant="light" size="sm" />
          <span className="text-xs text-white/40 font-medium uppercase tracking-widest">Admin</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold mb-8" style={{ fontFamily: 'var(--font-playfair)' }}>Ciudades</h1>

        <nav className="flex gap-1 mb-8">
          {[
            { href: '/admin', label: 'Resumen' },
            { href: '/admin/events', label: 'Eventos' },
            { href: '/admin/users', label: 'Usuarios' },
            { href: '/admin/cities', label: 'Ciudades', active: true },
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

        <CitiesManager cities={(cities ?? []) as City[]} />
      </main>
    </div>
  )
}
