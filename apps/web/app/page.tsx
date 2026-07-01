import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'

const TIERS = [
  {
    name: 'Gratuito',
    price: '€0',
    period: '/ mes',
    posts: '1 publicación / mes',
    features: ['1 evento al mes', 'Listado básico', 'Soporte por email'],
    cta: 'Empezar gratis',
    href: '/register',
    highlight: false,
  },
  {
    name: 'Básico',
    price: '€9,99',
    period: '/ mes',
    posts: '10 publicaciones / mes',
    features: ['10 eventos al mes', 'Imagen de cartel', 'Enlace a tu web', 'Soporte prioritario'],
    cta: 'Elegir Básico',
    href: '/register?plan=basic',
    highlight: true,
  },
  {
    name: 'Premium',
    price: '€100',
    period: '/ mes',
    posts: '100 publicaciones / mes',
    features: [
      '100 eventos al mes',
      'Imagen de cartel',
      'Enlace a tu web',
      'Badge destacado',
      'Soporte dedicado',
    ],
    cta: 'Elegir Premium',
    href: '/register?plan=premium',
    highlight: false,
  },
]

const FEATURES = [
  {
    icon: '🎭',
    title: 'Publica en minutos',
    desc: 'Crea tu evento con título, descripción, fechas e imagen. Sin complicaciones.',
  },
  {
    icon: '📍',
    title: 'Llega a tu ciudad',
    desc: 'Tu evento aparece en la app móvil de tu ciudad, visible para miles de vecinos.',
  },
  {
    icon: '📱',
    title: 'App móvil incluida',
    desc: 'Los ciudadanos descubren eventos desde su móvil con mapa interactivo.',
  },
  {
    icon: '🔔',
    title: 'Notificaciones push',
    desc: 'Cuando aprobamos tu evento, notificamos automáticamente a todos los usuarios.',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#1e2640] text-white overflow-x-hidden">
      {/* ── Nav ─────────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-3 bg-[#fcf6e3] border-b border-[#1e2640]/15 shadow-sm">
        <Logo size="sm" />
        {/* Brand name — absolutely centered on the full nav width */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[#1e2640] font-bold text-base tracking-tight hidden sm:block">
            Agenda Cultural de Terrassa
          </span>
        </div>
        <div className="flex items-center gap-4 relative z-10">
          <Link href="/login" className="text-sm text-[#1e2640]/60 hover:text-[#1e2640] transition">
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            className="text-sm font-semibold bg-gradient-to-r from-[#f4921e] to-[#2bc4b3] text-white rounded-full px-5 py-2 hover:opacity-90 transition"
          >
            Crear cuenta
          </Link>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center pt-28 px-6 overflow-hidden">
        {/* Background orbs */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden
        >
          <div
            className="absolute rounded-full blur-3xl opacity-30"
            style={{
              width: 600,
              height: 600,
              top: '-10%',
              left: '-10%',
              background: 'radial-gradient(circle, #2bc4b3, transparent 70%)',
            }}
          />
          <div
            className="absolute rounded-full blur-3xl opacity-25"
            style={{
              width: 500,
              height: 500,
              top: '20%',
              right: '-5%',
              background: 'radial-gradient(circle, #e8463a, transparent 70%)',
            }}
          />
          <div
            className="absolute rounded-full blur-3xl opacity-20"
            style={{
              width: 400,
              height: 400,
              bottom: '5%',
              left: '30%',
              background: 'radial-gradient(circle, #f4921e, transparent 70%)',
            }}
          />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm text-white/80 mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Plataforma de eventos culturales
          </div>

          <h1
            className="text-5xl sm:text-7xl font-bold leading-tight tracking-tight mb-6"
            style={{ fontFamily: 'var(--font-playfair)' }}
          >
            Conecta tu arte
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #f4921e 0%, #2bc4b3 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              con tu ciudad
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10">
            Publica tus eventos culturales — música, teatro, gastronomía y más — y llega a miles de personas que buscan qué hacer esta semana.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="rounded-full font-semibold px-8 py-4 text-base text-white transition hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #f4921e, #2bc4b3)',
              }}
            >
              Empieza gratis →
            </Link>
            <Link
              href="/login"
              className="rounded-full font-semibold px-8 py-4 text-base text-white bg-white/10 hover:bg-white/20 transition border border-white/20"
            >
              Iniciar sesión
            </Link>
          </div>

          {/* Floating event cards preview */}
          <div className="mt-16 flex justify-center gap-4 flex-wrap">
            {[
              { emoji: '🎸', name: 'Festival de Jazz', city: 'Barcelona', tag: 'Música' },
              { emoji: '🎭', name: 'Nit de Teatre', city: 'Terrassa', tag: 'Teatro' },
              { emoji: '🍷', name: 'Fira Gastronòmica', city: 'Sabadell', tag: 'Gastronomía' },
            ].map((card) => (
              <div
                key={card.name}
                className="flex items-center gap-3 bg-white/8 backdrop-blur-md border border-white/15 rounded-2xl px-4 py-3 text-left"
              >
                <span className="text-2xl">{card.emoji}</span>
                <div>
                  <p className="text-sm font-semibold text-white">{card.name}</p>
                  <p className="text-xs text-white/50">{card.city} · {card.tag}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats strip ─────────────────────────────────────────── */}
      <div className="border-y border-white/10 bg-white/5 py-10 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6 text-center">
          {[
            { value: '3', label: 'ciudades activas' },
            { value: '500+', label: 'organizadores' },
            { value: '10k+', label: 'ciudadanos activos' },
          ].map((s) => (
            <div key={s.label}>
              <p
                className="text-4xl font-bold"
                style={{
                  background: 'linear-gradient(135deg, #f4921e, #2bc4b3)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {s.value}
              </p>
              <p className="text-sm text-white/50 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Features ────────────────────────────────────────────── */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
          Todo lo que necesitas
        </h2>
        <p className="text-center text-white/50 mb-14 text-lg">
          Gestiona tus eventos desde un panel sencillo y profesional.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl p-6 border border-white/10 bg-white/5 hover:bg-white/8 transition group"
            >
              <span className="text-3xl mb-4 block">{f.icon}</span>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ─────────────────────────────────────────────── */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
          Planes y precios
        </h2>
        <p className="text-center text-white/50 mb-14 text-lg">
          Empieza gratis y escala cuando lo necesites.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl p-8 flex flex-col border transition ${
                tier.highlight
                  ? 'border-pink-500/50 shadow-2xl shadow-pink-500/20 bg-gradient-to-b from-white/10 to-white/5'
                  : 'border-white/10 bg-white/5'
              }`}
            >
              {tier.highlight && (
                <span
                  className="self-start mb-4 text-xs font-semibold text-white rounded-full px-3 py-1"
                  style={{ background: 'linear-gradient(135deg, #f4921e, #2bc4b3)' }}
                >
                  Más popular
                </span>
              )}
              <h3 className="text-lg font-semibold text-white">{tier.name}</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-white">{tier.price}</span>
                <span className="text-white/40">{tier.period}</span>
              </div>
              <p className="mt-1 text-sm font-medium text-amber-400">{tier.posts}</p>
              <ul className="mt-6 space-y-3 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-white/70">
                    <span className="text-amber-400">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link
                href={tier.href}
                className={`mt-8 rounded-xl px-4 py-3 text-center font-semibold transition ${
                  tier.highlight
                    ? 'text-white hover:opacity-90'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                style={
                  tier.highlight
                    ? { background: 'linear-gradient(135deg, #f4921e, #2bc4b3)' }
                    : undefined
                }
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <Logo variant="light" size="sm" />
          <div className="flex flex-wrap justify-center gap-6 text-sm text-white/40">
            <Link href="/privacidad" className="hover:text-white/80 transition">Privacidad</Link>
            <Link href="/cookies" className="hover:text-white/80 transition">Cookies</Link>
            <Link href="/terminos" className="hover:text-white/80 transition">Términos</Link>
            <Link href="/login" className="hover:text-white/80 transition">Acceso organizadores</Link>
          </div>
          <p className="text-xs text-white/30">© 2026 Agenda Cultural de Terrassa. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

