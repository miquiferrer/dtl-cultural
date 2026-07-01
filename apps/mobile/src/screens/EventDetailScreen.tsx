import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Linking,
  Platform,
  Modal,
  StatusBar,
  Dimensions,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { supabase } from '../lib/supabase'
import type { Event, EventCategory } from '@dtl-cultural/shared'
import { CATEGORY_LABELS, CATEGORY_SUBCATEGORIES } from '@dtl-cultural/shared'
import type { RootStackParamList } from '../../App'

function getSubcategoryLabel(category: EventCategory, sub: string | null): string | null {
  if (!sub) return null
  return CATEGORY_SUBCATEGORIES[category]?.find((s) => s.value === sub)?.label ?? null
}

type NavProp = NativeStackNavigationProp<RootStackParamList, 'EventDetail'>
type RouteType = RouteProp<RootStackParamList, 'EventDetail'>

export function EventDetailScreen() {
  const navigation = useNavigation<NavProp>()
  const route = useRoute<RouteType>()
  const { eventId } = route.params

  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [posterVisible, setPosterVisible] = useState(false)

  useEffect(() => {
    supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .eq('status', 'approved')
      .single()
      .then(({ data }) => {
        setEvent(data as Event)
        setLoading(false)
      })
  }, [eventId])

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#f4921e" />
      </View>
    )
  }

  if (!event) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Evento no encontrado.</Text>
      </View>
    )
  }

  const dateLabel = formatDate(event.start_date, event.end_date, event.start_time)
  const priceLabel = event.price != null ? `€${event.price}` : 'Gratuito'
  const subcategoryLabel = getSubcategoryLabel(event.category, event.subcategory ?? null)

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fcf6e3' }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Back button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>← Volver</Text>
        </TouchableOpacity>

        {/* Poster */}
        {event.poster_url ? (
          <>
            <TouchableOpacity activeOpacity={0.9} onPress={() => setPosterVisible(true)}>
              <Image source={{ uri: event.poster_url }} style={styles.poster} />
              <View style={styles.posterHint}>
                <Text style={styles.posterHintText}>🔍 Toca para ampliar</Text>
              </View>
            </TouchableOpacity>

            {/* Full-screen modal */}
            <Modal
              visible={posterVisible}
              transparent
              animationType="fade"
              onRequestClose={() => setPosterVisible(false)}
              statusBarTranslucent
            >
              <StatusBar hidden />
              <View style={styles.modalBackdrop}>
                <TouchableOpacity
                  style={styles.modalClose}
                  onPress={() => setPosterVisible(false)}
                >
                  <Text style={styles.modalCloseText}>✕</Text>
                </TouchableOpacity>
                <Image
                  source={{ uri: event.poster_url }}
                  style={styles.modalImage}
                  resizeMode="contain"
                />
              </View>
            </Modal>
          </>
        ) : null}

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.categoryRow}>
            <Text style={styles.categoryLabel}>{CATEGORY_LABELS[event.category] ?? event.category}</Text>
            {subcategoryLabel && (
              <Text style={styles.subcategoryLabel}>{subcategoryLabel}</Text>
            )}
          </View>

          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.date}>{dateLabel}</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Ubicación</Text>
            <Text style={styles.infoValue}>{event.location_text}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Precio</Text>
            <Text style={[styles.infoValue, event.price == null && { color: '#16a34a' }]}>
              {priceLabel}
            </Text>
          </View>

          {/* Map — tap to open Maps app */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => {
              const label = encodeURIComponent(event.location_text ?? event.title)
              const coords = `${event.latitude},${event.longitude}`
              const url =
                Platform.OS === 'ios'
                  ? `maps:?q=${label}&ll=${coords}`
                  : `geo:${coords}?q=${coords}(${label})`
              Linking.openURL(url).catch(() =>
                // Fallback to Google Maps web if native app unavailable
                Linking.openURL(
                  `https://www.google.com/maps/dir/?api=1&destination=${coords}`
                )
              )
            }}
          >
            <MapView
              provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
              style={styles.map}
              region={{
                latitude: event.latitude,
                longitude: event.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
              pitchEnabled={false}
              rotateEnabled={false}
            >
              <Marker
                coordinate={{ latitude: event.latitude, longitude: event.longitude }}
                title={event.title}
              />
            </MapView>
            <View style={styles.mapOverlay}>
              <Text style={styles.mapOverlayText}>Cómo llegar →</Text>
            </View>
          </TouchableOpacity>

          <Text style={styles.description}>{event.description}</Text>
          {/* Website CTA */}
          {event.website ? (
            <TouchableOpacity
              style={styles.websiteBtn}
              onPress={() => Linking.openURL(event.website!)}
            >
              <Text style={styles.websiteBtnText}>Más información →</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

function formatDate(start: string, end: string | null, time: string | null): string {
  const startDate = new Date(start + 'T00:00:00')
  const opts: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' }
  const startStr = startDate.toLocaleDateString('es-ES', opts)
  const timeStr = time ? ` · ${time.slice(0, 5)}` : ''
  if (!end || end === start) return `${startStr}${timeStr}`
  const endDate = new Date(end + 'T00:00:00')
  const endStr = endDate.toLocaleDateString('es-ES', opts)
  return `${startStr}${timeStr} – ${endStr}`
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fcf6e3',
  },
  errorText: {
    color: '#f87171',
    fontSize: 14,
  },
  container: {
    paddingBottom: 40,
    backgroundColor: '#fcf6e3',
  },
  backBtn: {
    padding: 16,
  },
  backBtnText: {
    fontSize: 14,
    color: '#f4921e',
    fontWeight: '600',
  },
  poster: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  posterHint: {
    position: 'absolute',
    bottom: 8,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  posterHintText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  // full-screen modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalClose: {
    position: 'absolute',
    top: 48,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  modalImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  content: {
    padding: 20,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#f59e0b',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  subcategoryLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(30,38,64,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1e2640',
    marginBottom: 6,
    lineHeight: 32,
  },
  date: {
    fontSize: 14,
    color: 'rgba(30,38,64,0.5)',
    marginBottom: 20,
    textTransform: 'capitalize',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(30,38,64,0.08)',
  },
  infoLabel: {
    fontSize: 13,
    color: 'rgba(30,38,64,0.4)',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 13,
    color: '#1e2640',
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  map: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginTop: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(30,38,64,0.1)',
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 10,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  mapOverlayText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e2640',
  },
  description: {
    fontSize: 15,
    color: 'rgba(30,38,64,0.65)',
    lineHeight: 24,
    marginBottom: 28,
  },
  websiteBtn: {
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: '#f4921e',
  },
  websiteBtnText: {
    color: '#1e2640',
    fontWeight: '800',
    fontSize: 16,
  },
})
