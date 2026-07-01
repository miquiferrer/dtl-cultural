'use client'

import { useState, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Logo } from '@/components/ui/Logo'
import { APIProvider, Map, AdvancedMarker, useMapsLibrary } from '@vis.gl/react-google-maps'
import type { MapMouseEvent } from '@vis.gl/react-google-maps'

// Terrassa default coordinates
const TERRASSA_LAT = 41.5631
const TERRASSA_LNG = 2.0089

interface NewLocation {
  label: string
  location_text: string
  lat: number
  lng: number
}

// ─── Location draft form (must be inside APIProvider to use useMapsLibrary) ────
function LocationDraftForm({
  onSave,
  onCancel,
}: {
  onSave: (loc: NewLocation) => void
  onCancel: () => void
}) {
  const [label, setLabel] = useState('')
  const [locationText, setLocationText] = useState('')
  const [lat, setLat] = useState(TERRASSA_LAT)
  const [lng, setLng] = useState(TERRASSA_LNG)
  const [markerSet, setMarkerSet] = useState(false)
  const [mapKey, setMapKey] = useState('draft-map')
  const [geocodeError, setGeocodeError] = useState<string | null>(null)
  const [geocoding, setGeocoding] = useState(false)

  const geocodingLib = useMapsLibrary('geocoding')

  async function handleSearch() {
    if (!geocodingLib || !locationText.trim()) return
    setGeocoding(true)
    setGeocodeError(null)
    const geocoder = new geocodingLib.Geocoder()
    try {
      const result = await geocoder.geocode({
        address: locationText.trim() + ', Terrassa, España',
      })
      if (result.results.length === 0) {
        setGeocodeError('No se encontró la dirección. Intenta ser más específico.')
        setGeocoding(false)
        return
      }
      const loc = result.results[0].geometry.location
      const formatted = result.results[0].formatted_address
      setLat(loc.lat())
      setLng(loc.lng())
      setLocationText(formatted)
      setMarkerSet(true)
      setMapKey(`map-${Date.now()}`)
    } catch {
      setGeocodeError('Error al buscar la dirección. Inténtalo de nuevo.')
    }
    setGeocoding(false)
  }

  function handleMapClick(e: MapMouseEvent) {
    if (!e.detail.latLng) return
    setLat(e.detail.latLng.lat)
    setLng(e.detail.latLng.lng)
    setMarkerSet(true)
  }

  const canSave = label.trim() !== '' && locationText.trim() !== '' && markerSet

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
      {/* Label */}
      <input
        type="text"
        placeholder="Nombre del local (ej: Teatro Principal)"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
      />

      {/* Address + search button */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Escribe la dirección…"
            value={locationText}
            onChange={(e) => { setLocationText(e.target.value); setMarkerSet(false) }}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSearch() } }}
            className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <button
            type="button"
            onClick={handleSearch}
            disabled={!locationText.trim() || geocoding}
            className="shrink-0 bg-white/10 hover:bg-white/20 disabled:opacity-40 text-white text-sm font-semibold rounded-xl px-3 py-2 transition"
          >
            {geocoding ? '…' : 'Buscar'}
          </button>
        </div>
        {geocodeError && <p className="text-xs text-red-400">{geocodeError}</p>}
        {!markerSet && !geocodeError && (
          <p className="text-xs text-white/30">Escribe la dirección y pulsa «Buscar» para fijarla en el mapa</p>
        )}
      </div>

      {/* Map — shown after geocoding */}
      {markerSet && (
        <>
          <p className="text-xs text-white/40">Puedes hacer clic en el mapa para ajustar la posición exacta</p>
          <div className="rounded-xl overflow-hidden border border-white/10">
            <Map
              key={mapKey}
              style={{ width: '100%', height: '180px' }}
              defaultCenter={{ lat, lng }}
              defaultZoom={16}
              gestureHandling="cooperative"
              mapId="register-location-map"
              onClick={handleMapClick}
            >
              <AdvancedMarker position={{ lat, lng }} />
            </Map>
          </div>
        </>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onSave({ label: label.trim(), location_text: locationText.trim(), lat, lng })}
          disabled={!canSave}
          className="flex-1 bg-white/10 hover:bg-white/20 disabled:opacity-40 text-white text-sm font-semibold rounded-xl px-3 py-2 transition"
        >
          Guardar
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-transparent border border-white/20 text-white/60 hover:text-white text-sm rounded-xl px-3 py-2 transition"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}

interface LocationDraft {
  id: string
  label: string
  location_text: string
  lat: number
  lng: number
}

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [orgName, setOrgName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // ─── Saved locations ───────────────────────────────────────
  const [locations, setLocations] = useState<LocationDraft[]>([])
  const [showLocationForm, setShowLocationForm] = useState(false)

  function addLocation(loc: NewLocation) {
    setLocations((prev) => [...prev, { id: `loc-${Date.now()}`, ...loc }])
    setShowLocationForm(false)
  }

  const removeLocation = useCallback((id: string) => {
    setLocations((prev) => prev.filter((l) => l.id !== id))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }
    setError(null)
    setLoading(true)

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        organization_name: orgName,
        locations: locations.map((l) => ({
          label: l.label,
          location_text: l.location_text,
          lat: l.lat,
          lng: l.lng,
        })),
      }),
    })

    const json = await res.json()

    if (!res.ok) {
      setError(json.error ?? 'Error al registrarse')
      setLoading(false)
      return
    }

    // Auto sign-in after successful registration
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError) {
      // Registration succeeded but sign-in failed — let user log in manually
      setSuccess(true)
      setLoading(false)
      return
    }

    // If plan was selected, redirect to subscription after login
    const plan = searchParams.get('plan')
    if (plan) {
      sessionStorage.setItem('pending_plan', plan)
    }

    router.push('/dashboard')
    router.refresh()
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold mb-2">Cuenta creada</h1>
          <p className="text-gray-500 text-sm">
            Tu cuenta ha sido creada con éxito. Ya puedes{' '}
            <a href="/login" className="text-pink-500 underline">iniciar sesión</a>.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: 'linear-gradient(135deg, #1e2640 0%, #1c0b2e 100%)' }}
    >
      <div className="fixed inset-0 pointer-events-none" aria-hidden>
        <div className="absolute rounded-full blur-3xl opacity-20" style={{ width: 400, height: 400, top: '-10%', right: '-10%', background: 'radial-gradient(circle, #2bc4b3, transparent 70%)' }} />
        <div className="absolute rounded-full blur-3xl opacity-15" style={{ width: 300, height: 300, bottom: '5%', left: '-5%', background: 'radial-gradient(circle, #f4921e, transparent 70%)' }} />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Logo variant="light" size="lg" />
        </div>

        <div className="bg-white/8 backdrop-blur-md border border-white/15 rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-white text-center mb-6">Crear cuenta</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Org name */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">
                Nombre de la organización
              </label>
              <input
                type="text"
                required
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            {/* Saved locations */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Locales / Direcciones <span className="text-white/30 font-normal">(opcional)</span>
              </label>

              {locations.length > 0 && (
                <ul className="space-y-2 mb-3">
                  {locations.map((loc) => (
                    <li key={loc.id} className="flex items-start justify-between gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                      <div>
                        <p className="text-sm font-semibold text-white">{loc.label}</p>
                        <p className="text-xs text-white/50">{loc.location_text}</p>
                      </div>
                      <button type="button" onClick={() => removeLocation(loc.id)} className="text-white/30 hover:text-red-400 transition text-lg leading-none mt-0.5" aria-label="Eliminar">×</button>
                    </li>
                  ))}
                </ul>
              )}

              {showLocationForm ? (
                <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? ''}>
                  <LocationDraftForm
                    onSave={addLocation}
                    onCancel={() => setShowLocationForm(false)}
                  />
                </APIProvider>
              ) : (
                <button type="button" onClick={() => setShowLocationForm(true)} className="w-full border border-dashed border-white/20 text-white/40 hover:text-white/60 hover:border-white/30 text-sm rounded-xl px-4 py-2.5 transition">+ Añadir local</button>
              )}
            </div>

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
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-2.5 pr-20 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/40 hover:text-white/70 transition"
                >
                  {showPassword ? 'Ocultar' : 'Ver'}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/70 mb-1">Confirmar contraseña</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/30 rounded-xl px-4 py-2.5 pr-20 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/40 hover:text-white/70 transition"
                >
                  {showConfirmPassword ? 'Ocultar' : 'Ver'}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-semibold rounded-xl px-4 py-3 disabled:opacity-50 transition hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #f4921e, #2bc4b3)' }}
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>
          <p className="text-center text-sm text-white/40 mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-pink-400 hover:text-pink-300 transition">
              Iniciar sesión
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

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  )
}

