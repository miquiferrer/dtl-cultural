import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import { CATEGORY_SUBCATEGORIES } from '@dtl-cultural/shared'
import type { EventCategory, EventSubcategory } from '@dtl-cultural/shared'

const ALL_CATEGORIES = Object.keys(CATEGORY_SUBCATEGORIES) as EventCategory[]

export type NotifPrefs = Partial<Record<EventCategory, EventSubcategory[]>>

interface Props {
  value: NotifPrefs
  onChange: (v: NotifPrefs) => void
  primaryColor?: string
}

/**
 * Category grid + per-category subcategory selector.
 * `value` maps EventCategory → selected EventSubcategory[].
 * An empty array means "all subcategories" for that category.
 */
export function CategorySubcatSelector({ value, onChange, primaryColor = '#f4921e' }: Props) {
  const { t, i18n } = useTranslation()

  const stripEmoji = (s: string) => s.replace(/^[^\w\u00C0-\u024F]+/, '').trim()
  const sortedCategories = ALL_CATEGORIES
    .map((cat) => ({ cat, label: t(`categories.${cat}`) }))
    .sort((a, b) => stripEmoji(a.label).localeCompare(stripEmoji(b.label), i18n.language))

  function toggleCategory(cat: EventCategory) {
    const next = { ...value }
    if (cat in next) {
      delete next[cat]
    } else {
      next[cat] = [] // empty = all subcategories
    }
    onChange(next)
  }

  function selectAllSubcats(cat: EventCategory) {
    onChange({ ...value, [cat]: [] })
  }

  function toggleSubcat(cat: EventCategory, sub: EventSubcategory) {
    const current = value[cat] ?? []
    const next = current.includes(sub)
      ? current.filter((s) => s !== sub)
      : [...current, sub]
    onChange({ ...value, [cat]: next })
  }

  return (
    <View>
      {/* ── Category grid ── */}
      <View style={styles.grid}>
        {sortedCategories.map(({ cat, label }) => {
          const selected = cat in value
          return (
            <TouchableOpacity
              key={cat}
              style={[
                styles.catPill,
                selected && { backgroundColor: primaryColor, borderColor: primaryColor },
              ]}
              onPress={() => toggleCategory(cat)}
              activeOpacity={0.75}
            >
              <Text style={[styles.catPillText, selected && styles.catPillTextActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>

      {/* ── Subcategory sections for each selected category ── */}
      {sortedCategories
        .filter(({ cat }) => cat in value)
        .map(({ cat, label }) => {
          const subcats = CATEGORY_SUBCATEGORIES[cat]
          const selectedSubs = value[cat] ?? []
          const isAll = selectedSubs.length === 0

          return (
            <View key={cat} style={styles.subcatSection}>
              {/* Section header */}
              <View style={[styles.subcatHeader, { borderLeftColor: primaryColor }]}>
                <Text style={styles.subcatHeaderText}>{label}</Text>
              </View>

              {/* Subcategory pills */}
              <View style={styles.subcatGrid}>
                {/* "Todas" pill */}
                <TouchableOpacity
                  style={[
                    styles.subcatPill,
                    isAll && { backgroundColor: primaryColor, borderColor: primaryColor },
                  ]}
                  onPress={() => selectAllSubcats(cat)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.subcatPillText, isAll && styles.subcatPillTextActive]}>
                    {t('filter.allSubcats')}
                  </Text>
                </TouchableOpacity>

                {subcats.map(({ value: sub, label: subLabel }) => {
                  const active = selectedSubs.includes(sub)
                  return (
                    <TouchableOpacity
                      key={sub}
                      style={[
                        styles.subcatPill,
                        active && { backgroundColor: primaryColor, borderColor: primaryColor },
                      ]}
                      onPress={() => toggleSubcat(cat, sub)}
                      activeOpacity={0.75}
                    >
                      <Text style={[styles.subcatPillText, active && styles.subcatPillTextActive]}>
                        {subLabel}
                      </Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>
          )
        })}
    </View>
  )
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  catPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(30,38,64,0.18)',
    backgroundColor: '#fff',
  },
  catPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e2640',
  },
  catPillTextActive: {
    color: '#fff',
  },
  subcatSection: {
    marginTop: 16,
  },
  subcatHeader: {
    borderLeftWidth: 3,
    borderLeftColor: '#f4921e', // overridden via inline style
    paddingLeft: 10,
    marginBottom: 8,
  },
  subcatHeaderText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(30,38,64,0.45)',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  subcatGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  subcatPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(30,38,64,0.14)',
    backgroundColor: '#f5f1e8',
  },
  subcatPillText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1e2640',
  },
  subcatPillTextActive: {
    color: '#fff',
  },
})
