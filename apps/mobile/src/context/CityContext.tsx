import React, { createContext, useContext, useEffect, useState } from 'react'
import Constants from 'expo-constants'
import { supabase } from '../lib/supabase'
import type { City } from '@dtl-cultural/shared'

interface CityContextValue {
  cities: City[]
  selectedCity: City | null
  setSelectedCity: (city: City) => void
  loading: boolean
}

const CityContext = createContext<CityContextValue>({
  cities: [],
  selectedCity: null,
  setSelectedCity: () => undefined,
  loading: true,
})

export function CityProvider({ children }: { children: React.ReactNode }) {
  const [cities, setCities] = useState<City[]>([])
  const [selectedCity, setSelectedCity] = useState<City | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('cities')
      .select('id, name, slug, config, created_at')
      .order('name')
      .then(({ data }) => {
        const list = (data ?? []) as City[]
        setCities(list)

        // Try to match the city configured at build time; fall back to the first one.
        const configSlug = Constants.expoConfig?.extra?.citySlug as string | undefined
        const initial =
          (configSlug ? list.find((c) => c.slug === configSlug) : undefined) ?? list[0] ?? null
        setSelectedCity(initial)
        setLoading(false)
      })
  }, [])

  return (
    <CityContext.Provider value={{ cities, selectedCity, setSelectedCity, loading }}>
      {children}
    </CityContext.Provider>
  )
}

export function useCityContext() {
  return useContext(CityContext)
}
