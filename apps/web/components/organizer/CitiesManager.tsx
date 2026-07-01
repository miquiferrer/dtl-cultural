'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { City } from '@dtl-cultural/shared'

interface Props {
  cities: City[]
}

export function CitiesManager({ cities }: Props) {
  const supabase = createClient()
  const router = useRouter()
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [primaryColor, setPrimaryColor] = useState('#6366f1')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await supabase.from('cities').insert({
      name,
      slug: slug.toLowerCase().replace(/\s+/g, '-'),
      config: { primaryColor, secondaryColor: primaryColor, appName: `Cultura ${name}` },
    })

    if (error) {
      setError(error.message)
    } else {
      setName('')
      setSlug('')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Añadir ciudad</h2>
      <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-8">
        <input
          type="text"
          required
          placeholder="Nombre (ej: Barcelona)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="text"
          required
          placeholder="Slug (ej: barcelona)"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-500 shrink-0">Color</label>
          <input
            type="color"
            value={primaryColor}
            onChange={(e) => setPrimaryColor(e.target.value)}
            className="h-9 w-16 rounded border border-gray-200 cursor-pointer"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition"
        >
          {loading ? 'Añadiendo...' : 'Añadir ciudad'}
        </button>
      </form>
      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left rounded-l-lg">Nombre</th>
              <th className="px-4 py-3 text-left">Slug</th>
              <th className="px-4 py-3 text-left">Color</th>
              <th className="px-4 py-3 text-left rounded-r-lg">EAS Profile</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {cities.map((city) => (
              <tr key={city.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{city.name}</td>
                <td className="px-4 py-3 text-gray-500 font-mono text-xs">{city.slug}</td>
                <td className="px-4 py-3">
                  <div
                    className="w-6 h-6 rounded-full border border-gray-200"
                    style={{ backgroundColor: (city.config as any).primaryColor }}
                  />
                </td>
                <td className="px-4 py-3 font-mono text-xs text-gray-400">
                  eas build --profile {city.slug}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
