import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native'
import * as Location from 'expo-location'
import { SafeAreaView } from 'react-native-safe-area-context'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { DateFilter, getDateRange } from '../components/DateFilter'
import type { DateRange } from '../components/DateFilter'
import type { Event } from '@dtl-cultural/shared'
import { CATEGORY_LABELS } from '@dtl-cultural/shared'
import type { RootStackParamList } from '../../App'

const CITY_SLUG = 'terrassa'

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Map'>

const CATEGORY_COLORS: Record<string, string> = {
  music: '#2bc4b3',
  theatre: '#e8463a',
  food: '#f4921e',
  other: '#6b7280',
}

// ─── Location grouping ────────────────────────────────────────
// Groups events that share the exact same coordinates into one map pin.
type LocationGroup = {
  key: string
  events: Event[]
  latitude: number
  longitude: number
}

function groupEventsByLocation(events: Event[]): LocationGroup[] {
  const map = new Map<string, LocationGroup>()
  for (const e of events) {
    const key = `${e.latitude},${e.longitude}`
    if (map.has(key)) {
      map.get(key)!.events.push(e)
    } else {
      map.set(key, { key, events: [e], latitude: e.latitude, longitude: e.longitude })
    }
  }
  return Array.from(map.values())
}

function computeRegion(events: Event[]) {
  const fallback = { latitude: 41.3851, longitude: 2.1734, latitudeDelta: 0.08, longitudeDelta: 0.08 }
  if (events.length === 0) return fallback
  if (events.length === 1) {
    return { latitude: events[0]!.latitude, longitude: events[0]!.longitude, latitudeDelta: 0.02, longitudeDelta: 0.02 }
  }
  const lats = events.map((e) => e.latitude)
  const lngs = events.map((e) => e.longitude)
  const minLat = Math.min(...lats)
  const maxLat = Math.max(...lats)
  const minLng = Math.min(...lngs)
  const maxLng = Math.max(...lngs)
  const pad = 0.01
  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.max(maxLat - minLat + pad * 2, 0.02),
    longitudeDelta: Math.max(maxLng - minLng + pad * 2, 0.02),
  }
}

async function fetchMapEvents(dateFrom: string | null, dateTo: string | null): Promise<Event[]> {
  const { data: city } = await supabase
    .from('cities')
    .select('id')
    .eq('slug', CITY_SLUG)
    .single()

  if (!city) return []

  const today = new Date().toISOString().split('T')[0]!
  let query = supabase
    .from('events')
    .select('id, title, category, subcategory, start_date, start_time, latitude, longitude, location_text, price')
    .eq('city_id', city.id)
    .eq('status', 'approved')
    .gte('start_date', dateFrom ?? today)
    .order('start_date', { ascending: true })

  if (dateTo) query = query.lte('start_date', dateTo)
  else if (!dateFrom) query = query.eq('start_date', today) // default: today only

  const { data } = await query
  return (data ?? []) as Event[]
}

export function MapScreen() {
  const navigation = useNavigation<NavProp>()
  const { t } = useTranslation()
  const [selectedGroup, setSelectedGroup] = useState<Event[] | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [markersReady, setMarkersReady] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange>(getDateRange('all'))
  const markerJustPressed = useRef(false)
  const queryClient = useQueryClient()

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['map-events', CITY_SLUG, dateRange.from, dateRange.to],
    queryFn: () => fetchMapEvents(dateRange.from, dateRange.to),
    staleTime: 0,
  })

  useFocusEffect(
    useCallback(() => {
      queryClient.invalidateQueries({ queryKey: ['map-events', CITY_SLUG] })
    }, [queryClient])
  )

  // Request location permission so showsUserLocation works on Android
  useEffect(() => {
    Location.requestForegroundPermissionsAsync()
  }, [])

  // Reset state on mount / event list change
  useEffect(() => {
    setSelectedGroup(null)
    setSelectedIndex(0)
    setMarkersReady(false)
  }, [])

  // On Android/PROVIDER_GOOGLE, custom marker views require tracksViewChanges=true
  // during their initial paint. Reset whenever the event IDs change so that any
  // newly added events get a proper render cycle before the flag is frozen.
  const eventsKey = events.map((e) => e.id).join(',')
  useEffect(() => {
    setMarkersReady(false)
    const timer = setTimeout(() => setMarkersReady(true), 300)
    return () => clearTimeout(timer)
  }, [eventsKey])

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#f4921e" />
      </View>
    )
  }

  const validEvents = events.filter((e) => e.latitude && e.longitude)
  const locationGroups = groupEventsByLocation(validEvents)
  const initialRegion = computeRegion(validEvents)

  const selectedEvent = selectedGroup?.[selectedIndex] ?? null
  const categoryColor = selectedEvent
    ? (CATEGORY_COLORS[selectedEvent.category] ?? '#6b7280')
    : '#6b7280'
  const isMulti = (selectedGroup?.length ?? 0) > 1

  return (
    <SafeAreaView style={styles.container}>
      {/* Date filter bar */}
      <View style={styles.dateBar}>
        <DateFilter
          dateRange={dateRange}
          onDateRangeChange={(r) => {
            setDateRange(r)
            setSelectedGroup(null)
          }}
          primaryColor="#f4921e"
        />
      </View>

      <MapView
        key="terrassa"
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton
        onPress={() => {
          if (markerJustPressed.current) {
            markerJustPressed.current = false
            return
          }
          setSelectedGroup(null)
        }}
      >
        {locationGroups.map((group) => {
          const firstEvent = group.events[0]!
          const color = CATEGORY_COLORS[firstEvent.category] ?? '#6b7280'
          const hasMultiple = group.events.length > 1
          return (
            <Marker
              key={group.key}
              identifier={group.key}
              coordinate={{ latitude: group.latitude, longitude: group.longitude }}
              tracksViewChanges={!markersReady}
              onPress={() => {
                markerJustPressed.current = true
                setSelectedGroup(group.events)
                setSelectedIndex(0)
              }}
            >
              <View style={[styles.markerPin, { backgroundColor: color }]}>
                {hasMultiple && (
                  <Text style={styles.markerCount}>{group.events.length}</Text>
                )}
              </View>
            </Marker>
          )
        })}
      </MapView>

      {/* Empty state */}
      {validEvents.length === 0 && (
        <View style={styles.emptyOverlay} pointerEvents="none">
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>💭</Text>
            <Text style={styles.emptyTitle}>{t('map.noEventsTitle')}</Text>
            <Text style={styles.emptySubtitle}>{t('map.noEventsDesc')}</Text>
          </View>
        </View>
      )}

      {/* Event info card — shown when a marker is tapped */}
      {selectedEvent && (
        <View style={styles.card}>
          {/* Multi-event navigator */}
          {isMulti && (
            <View style={styles.multiHeader}>
              <TouchableOpacity
                onPress={() => setSelectedIndex((i) => Math.max(0, i - 1))}
                disabled={selectedIndex === 0}
                hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}
              >
                <Text style={[styles.navArrow, selectedIndex === 0 && styles.navArrowDisabled]}>‹</Text>
              </TouchableOpacity>
              <Text style={styles.multiCounter}>
                {selectedIndex + 1} / {selectedGroup!.length} eventos aquí
              </Text>
              <TouchableOpacity
                onPress={() => setSelectedIndex((i) => Math.min(selectedGroup!.length - 1, i + 1))}
                disabled={selectedIndex === selectedGroup!.length - 1}
                hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}
              >
                <Text style={[styles.navArrow, selectedIndex === selectedGroup!.length - 1 && styles.navArrowDisabled]}>›</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.cardHeader}>
            <View style={[styles.categoryDot, { backgroundColor: categoryColor }]} />
            <Text style={[styles.cardCategory, { color: categoryColor }]}>
              {CATEGORY_LABELS[selectedEvent.category]}
            </Text>
            <TouchableOpacity
              onPress={() => setSelectedGroup(null)}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={styles.closeBtn}
            >
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.cardTitle} numberOfLines={2}>
            {selectedEvent.title}
          </Text>
          <Text style={styles.cardDate}>{selectedEvent.start_date}</Text>
          {selectedEvent.location_text ? (
            <Text style={styles.cardLocation} numberOfLines={1}>
              {selectedEvent.location_text}
            </Text>
          ) : null}

          <TouchableOpacity
            style={[styles.detailBtn, { backgroundColor: categoryColor }]}
            onPress={() => {
              setSelectedGroup(null)
              navigation.navigate('EventDetail', { eventId: selectedEvent.id })
            }}
          >
            <Text style={styles.detailBtnText}>{t('map.seeDetail')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcf6e3',
  },
  dateBar: {
    paddingVertical: 6,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
    backgroundColor: '#fcf6e3',
  },
  map: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fcf6e3',
  },
  // ─── Custom map pin ───────────────────────────────────────────
  markerPin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  markerCount: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  // ─── Multi-event navigator ────────────────────────────────────
  multiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  navArrow: {
    fontSize: 28,
    fontWeight: '300',
    color: '#ffffff',
    lineHeight: 30,
  },
  navArrowDisabled: {
    opacity: 0.2,
  },
  multiCounter: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 0.4,
  },
  // ─── Event card overlay ───────────────────────────────────────
  card: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: '#1a2535',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  cardCategory: {
    flex: 1,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  closeBtn: {
    padding: 4,
  },
  closeBtnText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
    lineHeight: 22,
  },
  cardDate: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.45)',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  cardLocation: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.3)',
    marginBottom: 14,
  },
  detailBtn: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  detailBtnText: {
    color: '#0d0620',
    fontWeight: '800',
    fontSize: 14,
  },
  // ─── Empty state ──────────────────────────────────────────────
  emptyOverlay: {
    position: 'absolute',
    bottom: 80,
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  emptyCard: {
    backgroundColor: '#fcf6e3',
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  emptyEmoji: {
    fontSize: 36,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1e2640',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#1e2640',
    opacity: 0.6,
    textAlign: 'center',
    lineHeight: 20,
  },
})

