import { useInfiniteQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { EventCategory, EventSubcategory } from '@dtl-cultural/shared'

const PAGE_SIZE = 20
const CITY_SLUG = 'terrassa'

async function fetchCityId(): Promise<string> {
  const { data, error } = await supabase
    .from('cities')
    .select('id')
    .eq('slug', CITY_SLUG)
    .single()
  if (error || !data) throw new Error('Ciudad no encontrada.')
  return data.id
}

async function fetchEventsPage({
  cityId,
  category,
  subcategories,
  offset,
  dateFrom,
  dateTo,
}: {
  cityId: string
  category: EventCategory | null
  subcategories: EventSubcategory[]
  offset: number
  dateFrom: string | null
  dateTo: string | null
}) {
  const today = new Date().toISOString().split('T')[0]!
  let query = supabase
    .from('events')
    .select('*')
    .eq('city_id', cityId)
    .eq('status', 'approved')
    .gte('start_date', dateFrom ?? today)
    .order('start_date', { ascending: true })
    .order('start_time', { ascending: true, nullsFirst: false })
    .range(offset, offset + PAGE_SIZE - 1)

  if (dateTo) query = query.lte('start_date', dateTo)
  if (category) query = query.eq('category', category)
  if (subcategories.length > 0) query = query.in('subcategory', subcategories)

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export function useEvents(
  category: EventCategory | null,
  subcategories: EventSubcategory[] = [],
  dateFrom: string | null = null,
  dateTo: string | null = null,
) {
  const query = useInfiniteQuery({
    queryKey: ['events', CITY_SLUG, category, subcategories, dateFrom, dateTo],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const cityId = await fetchCityId()
      return fetchEventsPage({ cityId, category, subcategories, offset: pageParam as number, dateFrom, dateTo })
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PAGE_SIZE) return undefined
      return allPages.length * PAGE_SIZE
    },
  })

  const events = query.data?.pages.flat() ?? []

  return {
    events,
    loading: query.isLoading,
    error: query.isError ? 'Error al cargar los eventos.' : null,
    refetch: query.refetch,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
  }
}
