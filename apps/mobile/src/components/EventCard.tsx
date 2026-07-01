import React from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import type { Event, EventCategory } from '@dtl-cultural/shared'
import { CATEGORY_LABELS, CATEGORY_SUBCATEGORIES } from '@dtl-cultural/shared'

function getSubcategoryLabel(category: EventCategory, sub: string | null): string | null {
  if (!sub) return null
  // Try to find the label in the known subcategory list
  const found = CATEGORY_SUBCATEGORIES[category]?.find((s) => s.value === sub)?.label
  if (found) return found
  // Fallback: format the raw value (e.g. 'jam_sessions' → 'jam sessions')
  return sub.replace(/_/g, ' ')
}

const CATEGORY_COLORS: Record<string, string> = {
  music: '#2bc4b3',
  theatre: '#e8463a',
  food: '#f4921e',
  other: '#6b7280',
}

interface Props {
  event: Event
  onPress: () => void
}

export function EventCard({ event, onPress }: Props) {
  const { t } = useTranslation()
  const categoryColor = CATEGORY_COLORS[event.category] ?? '#6b7280'
  const subcategoryLabel = getSubcategoryLabel(event.category, event.subcategory ?? null)
  const isToday =
    event.start_date === new Date().toISOString().split('T')[0]

  const dateLabel = formatDate(event.start_date, event.end_date, event.start_time)
  const priceLabel = event.price != null ? `€${event.price}` : t('events.priceUnknown')

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {event.poster_url ? (
        <Image source={{ uri: event.poster_url }} style={styles.image} />
      ) : (
        <View style={[styles.imagePlaceholder, { backgroundColor: categoryColor + '22' }]}>
          <Text style={[styles.imagePlaceholderText, { color: categoryColor }]}>
            {CATEGORY_LABELS[event.category]}
          </Text>
        </View>
      )}
      <View style={styles.content}>
        <View style={styles.badges}>
          <View style={[styles.badge, { backgroundColor: categoryColor + '20', borderColor: categoryColor + '40' }]}>
            <Text style={[styles.badgeText, { color: categoryColor }]}>
              {CATEGORY_LABELS[event.category]}
            </Text>
          </View>
          {subcategoryLabel && (
            <View style={styles.subcatBadge}>
              <Text style={styles.subcatBadgeText}>{subcategoryLabel}</Text>
            </View>
          )}
          {isToday && (
            <View style={styles.todayBadge}>
              <Text style={styles.todayBadgeText}>{t('events.todayBadge')}</Text>
            </View>
          )}
        </View>
        <Text style={styles.title} numberOfLines={2}>
          {event.title}
        </Text>
        <Text style={styles.date}>{dateLabel}</Text>
        <View style={styles.footer}>
          <Text style={styles.location} numberOfLines={1}>
            {event.location_text}
          </Text>
          <Text style={styles.price}>
            {priceLabel}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

function formatDate(start: string, end: string | null, time: string | null): string {
  const startDate = new Date(start + 'T00:00:00')
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }
  const startStr = startDate.toLocaleDateString('es-ES', opts)
  const timeStr = time ? ` · ${time.slice(0, 5)}` : ''
  if (!end || end === start) return `${startStr}${timeStr}`
  const endDate = new Date(end + 'T00:00:00')
  const endStr = endDate.toLocaleDateString('es-ES', opts)
  return `${startStr}${timeStr} – ${endStr}`
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(30,38,64,0.07)',
    shadowColor: '#1e2640',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    padding: 14,
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 100,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  subcatBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 100,
    backgroundColor: 'rgba(30,38,64,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(30,38,64,0.12)',
  },
  subcatBadgeText: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(30,38,64,0.5)',
  },
  todayBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 100,
    backgroundColor: 'rgba(244,146,30,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(244,146,30,0.35)',
  },
  todayBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#f4921e',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e2640',
    marginBottom: 4,
  },
  date: {
    fontSize: 13,
    color: 'rgba(30,38,64,0.5)',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  location: {
    fontSize: 12,
    color: 'rgba(30,38,64,0.45)',
    flex: 1,
    marginRight: 8,
  },
  price: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(30,38,64,0.7)',
  },
})
