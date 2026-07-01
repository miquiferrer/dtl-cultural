'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { APIProvider, Map, AdvancedMarker, type MapMouseEvent } from '@vis.gl/react-google-maps'
import { createClient } from '@/lib/supabase/client'
import type { Event, EventCategory, EventSubcategory, CreateEventInput, OrganizerLocation, CATEGORY_SUBCATEGORIES as CatSubType } from '@dtl-cultural/shared'
import { CATEGORY_SUBCATEGORIES, CATEGORY_LABELS } from '@dtl-cultural/shared'

const CATEGORIES = (Object.keys(CATEGORY_LABELS) as EventCategory[]).map((value) => ({
  value,
  label: CATEGORY_LABELS[value],
}))

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

interface Props {
  event?: Event
  organizerId: string
  cityId: string
  savedLocations?: OrganizerLocation[]
}

export function EventForm({ event, organizerId, cityId, savedLocations }: Props) {
  const router = useRouter()
  const supabase = createClient()

  const firstLocation = savedLocations?.[0] ?? null

  const [title, setTitle] = useState(event?.title ?? '')
  const [description, setDescription] = useState(event?.description ?? '')
  const [category, setCategory] = useState<EventCategory>(event?.category ?? 'music')
  const [subcategory, setSubcategory] = useState<EventSubcategory | null>(event?.subcategory ?? null)
  const [startDate, setStartDate] = useState(event?.start_date ?? '')
  const [endDate, setEndDate] = useState(event?.end_date ?? '')
  const [startTime, setStartTime] = useState(event?.start_time?.slice(0, 5) ?? '')
  const [endTime, setEndTime] = useState(event?.end_time?.slice(0, 5) ?? '')
  const [price, setPrice] = useState(event?.price?.toString() ?? '')
  const [locationText, setLocationText] = useState(event?.location_text ?? firstLocation?.location_text ?? '')
  const [lat, setLat] = useState(event?.latitude ?? firstLocation?.latitude ?? 41.5631)
  const [lng, setLng] = useState(event?.longitude ?? firstLocation?.longitude ?? 2.0089)
  const [markerSet, setMarkerSet] = useState(!!(event?.latitude ?? firstLocation?.latitude))
  const [mapKey, setMapKey] = useState('event-map')
  const [posterFile, setPosterFile] = useState<File | null>(null)
  const [posterUrl, setPosterUrl] = useState(event?.poster_url ?? '')
  const [blobPreviewUrl, setBlobPreviewUrl] = useState<string | null>(null)

  // Revoke blob URL when component unmounts or file changes
  useEffect(() => {
    return () => { if (blobPreviewUrl) URL.revokeObjectURL(blobPreviewUrl) }
  }, [blobPreviewUrl])
  const [website, setWebsite] = useState(event?.website ?? '')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  function applysavedLocation(locId: string) {
    const loc = savedLocations?.find((l) => l.id === locId)
    if (!loc) return
    setLocationText(loc.location_text)
    setLat(loc.latitude)
    setLng(loc.longitude)
    setMarkerSet(true)
    setMapKey(`event-map-${loc.id}`)
  }

  function handleMapClick(e: MapMouseEvent) {
    if (!e.detail.latLng) return
    setLat(e.detail.latLng.lat)
    setLng(e.detail.latLng.lng)
    setMarkerSet(true)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Solo se permiten imágenes JPG, PNG o WebP.')
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('El archivo supera el tamaño máximo de 5 MB.')
      return
    }

    setError(null)
    if (blobPreviewUrl) URL.revokeObjectURL(blobPreviewUrl)
    setBlobPreviewUrl(URL.createObjectURL(file))
    setPosterFile(file)
    setPosterUrl('') // clear URL if file is chosen
  }

  async function uploadPoster(file: File): Promise<string> {
    const ext = file.name.split('.').pop()
    const path = `${organizerId}/${Date.now()}.${ext}`
    const { error } = await supabase.storage.from('event-posters').upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    })
    if (error) throw new Error('Error al subir la imagen.')
    const { data } = supabase.storage.from('event-posters').getPublicUrl(path)
    return data.publicUrl
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!markerSet) {
      setError('Por favor, selecciona la ubicación del evento en el mapa.')
      return
    }

    setLoading(true)

    try {
      let finalPosterUrl = posterUrl || null

      if (posterFile) {
        finalPosterUrl = await uploadPoster(posterFile)
      }

      const payload: CreateEventInput = {
        title,
        description,
        category,
        subcategory: subcategory ?? null,
        start_date: startDate,
        end_date: endDate || null,
        start_time: startTime || null,
        end_time: endTime || null,
        price: price ? parseFloat(price) : null,
        location_text: locationText,
        latitude: lat,
        longitude: lng,
        poster_url: finalPosterUrl,
        website: website || null,
      }

      if (event) {
        // Edit mode
        const { error } = await supabase
          .from('events')
          .update(payload)
          .eq('id', event.id)
          .eq('organizer_id', organizerId)

        if (error) throw new Error(error.message)
      } else {
        // Create mode
        const { error } = await supabase.from('events').insert({
          ...payload,
          organizer_id: organizerId,
          city_id: cityId,
        })

        if (error) {
          if (error.message.includes('POST_LIMIT_REACHED')) {
            throw new Error(
              'Has alcanzado el límite de publicaciones de tu plan. Actualiza tu suscripción.',
            )
          }
          throw new Error(error.message)
        }
      }

      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ha ocurrido un error.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-white/70 mb-1">Título *</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-white/70 mb-1">Descripción *</label>
        <textarea
          required
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50 resize-none"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-white/70 mb-1">Categoría *</label>
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value as EventCategory); setSubcategory(null) }}
          className="w-full bg-[#1c0b2e] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value} className="bg-[#1c0b2e]">
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {/* Subcategory */}
      <div>
        <label className="block text-sm font-medium text-white/70 mb-1">Subcategoría</label>
        <select
          value={subcategory ?? ''}
          onChange={(e) => setSubcategory((e.target.value as EventSubcategory) || null)}
          className="w-full bg-[#1c0b2e] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50"
        >
          <option value="" className="bg-[#1c0b2e]">— Sin subcategoría —</option>
          {CATEGORY_SUBCATEGORIES[category].map((s) => (
            <option key={s.value} value={s.value} className="bg-[#1c0b2e]">
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">Fecha de inicio *</label>
          <input
            type="date"
            required
            value={startDate}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 [color-scheme:dark]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">Fecha de fin (opcional)</label>
          <input
            type="date"
            value={endDate}
            min={startDate || new Date().toISOString().split('T')[0]}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 [color-scheme:dark]"
          />
        </div>
      </div>

      {/* Times */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">Hora de inicio (opcional)</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 [color-scheme:dark]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/70 mb-1">Hora de fin (opcional)</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-400/50 [color-scheme:dark]"
          />
        </div>
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium text-white/70 mb-1">
          Precio (€) — dejar en blanco si es gratuito
        </label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
          placeholder="0.00"
        />
      </div>

      {/* Location text */}
      <div>
        <label className="block text-sm font-medium text-white/70 mb-1">Dirección del evento *</label>
        {savedLocations && savedLocations.length > 0 && (
          <select
            className="w-full bg-[#1c0b2e] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white/70 focus:outline-none focus:ring-2 focus:ring-amber-400/50 mb-2"
            defaultValue=""
            onChange={(e) => applysavedLocation(e.target.value)}
          >
            <option value="" className="bg-[#1c0b2e]">— Usar dirección guardada —</option>
            {savedLocations.map((loc) => (
              <option key={loc.id} value={loc.id} className="bg-[#1c0b2e]">
                {loc.label} — {loc.location_text}
              </option>
            ))}
          </select>
        )}
        <input
          type="text"
          required
          value={locationText}
          onChange={(e) => setLocationText(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
          placeholder="Carrer de la Rambla 12, Terrassa"
        />
      </div>

      {/* Map picker */}
      <div>
        <label className="block text-sm font-medium text-white/70 mb-1">
          Ubicación en el mapa *{' '}
          <span className="font-normal text-white/30">(haz clic para fijar la ubicación)</span>
        </label>
        <div className="rounded-xl overflow-hidden border border-white/10">
          <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? ''}>
            <Map
              key={mapKey}
              style={{ width: '100%', height: '280px' }}
              defaultCenter={{ lat, lng }}
              defaultZoom={13}
              onClick={handleMapClick}
              gestureHandling="cooperative"
              mapId="event-location-map"
            >
              {markerSet && <AdvancedMarker position={{ lat, lng }} />}
            </Map>
          </APIProvider>
        </div>
        {markerSet && (
          <p className="text-xs text-white/30 mt-1">
            Lat: {lat.toFixed(5)}, Lng: {lng.toFixed(5)}
          </p>
        )}
      </div>

      {/* Poster */}
      <div>
        <label className="block text-sm font-medium text-white/70 mb-1">Imagen del cartel (opcional)</label>
        <div className="space-y-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="w-full text-sm text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20"
          />
          {blobPreviewUrl && (
            <a
              href={blobPreviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400 hover:text-amber-300 transition"
            >
              <span>🔍</span> Ver imagen seleccionada
            </a>
          )}
          <p className="text-xs text-white/30">JPG, PNG o WebP · Máx. 5 MB</p>
          <p className="text-xs text-white/30">— o proporciona una URL —</p>
          <input
            type="url"
            value={posterUrl}
            onChange={(e) => {
              setPosterUrl(e.target.value)
              setPosterFile(null)
              if (blobPreviewUrl) { URL.revokeObjectURL(blobPreviewUrl); setBlobPreviewUrl(null) }
              if (fileRef.current) fileRef.current.value = ''
            }}
            placeholder="https://ejemplo.com/cartel.jpg"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
          />
          {posterUrl && !posterFile && (
            <a
              href={posterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400 hover:text-amber-300 transition"
            >
              <span>🔍</span> Ver imagen actual
            </a>
          )}
        </div>
      </div>

      {/* Website */}
      <div>
        <label className="block text-sm font-medium text-white/70 mb-1">Página web (opcional)</label>
        <input
          type="url"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="https://miconcierto.com"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
        />
      </div>

      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded-xl px-4 py-3 font-semibold text-white disabled:opacity-50 transition hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #f4921e, #2bc4b3)' }}
        >
          {loading ? 'Guardando...' : event ? 'Guardar cambios' : 'Publicar evento'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-3 rounded-xl border border-white/10 text-white/70 hover:bg-white/5 transition text-sm font-medium"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
