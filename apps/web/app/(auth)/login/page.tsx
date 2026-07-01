'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Logo } from '@/components/ui/Logo'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Correo o contraseña incorrectos.')
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #1e2640 0%, #1c0b2e 100%)' }}
    >
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none" aria-hidden>
        <div className="absolute rounded-full blur-3xl opacity-20" style={{ width: 400, height: 400, top: '-10%', left: '-10%', background: 'radial-gradient(circle, #2bc4b3, transparent 70%)' }} />
        <div className="absolute rounded-full blur-3xl opacity-15" style={{ width: 300, height: 300, bottom: '10%', right: '-5%', background: 'radial-gradient(circle, #e8463a, transparent 70%)' }} />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo variant="light" size="lg" />
        </div>

        <div className="bg-white/8 backdrop-blur-md border border-white/15 rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-white text-center mb-6">Iniciar sesión</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Contraseña</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-semibold rounded-xl px-4 py-3 disabled:opacity-50 transition hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #f4921e, #2bc4b3)' }}
            >
              {loading ? 'Cargando...' : 'Iniciar sesión'}
            </button>
          </form>
          <p className="text-center text-sm text-white/40 mt-6">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="text-pink-400 hover:text-pink-300 transition">
              Regístrate
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-white/20 mt-6">
          <Link href="/" className="hover:text-white/40 transition">← Volver al inicio</Link>
        </p>
      </div>
    </div>
  )
}
