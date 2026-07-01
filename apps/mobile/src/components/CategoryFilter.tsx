import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native'
import { useTranslation } from 'react-i18next'
import { CATEGORY_LABELS, CATEGORY_SUBCATEGORIES } from '@dtl-cultural/shared'
import type { EventCategory, EventSubcategory } from '@dtl-cultural/shared'

const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as EventCategory[]

interface Props {
  selectedCategory: EventCategory | null
  selectedSubcategories: EventSubcategory[]
  onCategoryChange: (category: EventCategory | null) => void
  onSubcategoriesChange: (subs: EventSubcategory[]) => void
  primaryColor?: string
}

export function CategoryFilter({
  selectedCategory,
  selectedSubcategories,
  onCategoryChange,
  onSubcategoriesChange,
  primaryColor = '#f4921e',
}: Props) {
  const { t, i18n } = useTranslation()
  const [subcatModalFor, setSubcatModalFor] = useState<EventCategory | null>(null)

  // Build sorted category list — sorted alphabetically by translated label (emoji stripped)
  const stripEmoji = (s: string) => s.replace(/^[^\w\u00C0-\u024F]+/, '').trim()
  const CATEGORIES = ALL_CATEGORIES
    .map((value) => ({ value, label: t(`categories.${value}`) }))
    .sort((a, b) => stripEmoji(a.label).localeCompare(stripEmoji(b.label), i18n.language))

  function handleCategoryPress(cat: EventCategory | null) {
    if (cat === null) {
      onCategoryChange(null)
      onSubcategoriesChange([])
      return
    }
    // Change category if different, then always open the subcategory modal
    if (selectedCategory !== cat) {
      onCategoryChange(cat)
      onSubcategoriesChange([])
    }
    setSubcatModalFor(cat)
  }

  function toggleSubcategory(sub: EventSubcategory) {
    if (selectedSubcategories.includes(sub)) {
      onSubcategoriesChange(selectedSubcategories.filter((s) => s !== sub))
    } else {
      onSubcategoriesChange([...selectedSubcategories, sub])
    }
  }

  const subcatOptions = subcatModalFor ? CATEGORY_SUBCATEGORIES[subcatModalFor] : []

  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.container}
      >
        {/* All */}
        <TouchableOpacity
          onPress={() => handleCategoryPress(null)}
          style={[
            styles.pill,
            selectedCategory === null && { backgroundColor: primaryColor, borderColor: primaryColor },
          ]}
        >
          <Text style={[styles.pillText, selectedCategory === null && styles.pillTextSelected]}>
            {t('categories.all')}
          </Text>
        </TouchableOpacity>

        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.value
          const hasSubs = isSelected && selectedSubcategories.length > 0
          return (
            <TouchableOpacity
              key={cat.value}
              onPress={() => handleCategoryPress(cat.value)}
              style={[
                styles.pill,
                isSelected && { backgroundColor: primaryColor, borderColor: primaryColor },
              ]}
            >
              <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>
                {cat.label}
                {hasSubs ? ` (${selectedSubcategories.length})` : ''}
                {isSelected ? ' ▾' : ''}
              </Text>
            </TouchableOpacity>
          )
        })}
      </ScrollView>

      {/* Subcategory modal */}
      <Modal
        visible={subcatModalFor !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSubcatModalFor(null)}
      >
        <Pressable style={styles.backdrop} onPress={() => setSubcatModalFor(null)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>
              {subcatModalFor ? t(`categories.${subcatModalFor}`) : ''}
            </Text>
            <Text style={styles.sheetHint}>{t('filter.selectSubcats')}</Text>

            <ScrollView contentContainerStyle={styles.subGrid}>
              {/* All subcategories */}
              <TouchableOpacity
                style={[
                  styles.subPill,
                  selectedSubcategories.length === 0 && styles.subPillSelected,
                ]}
                onPress={() => onSubcategoriesChange([])}
              >
                <Text
                  style={[
                    styles.subPillText,
                    selectedSubcategories.length === 0 && styles.subPillTextSelected,
                  ]}
                >
                  {t('filter.allSubcats')}
                </Text>
              </TouchableOpacity>

              {subcatOptions.map((s) => {
                const active = selectedSubcategories.includes(s.value)
                return (
                  <TouchableOpacity
                    key={s.value}
                    style={[styles.subPill, active && styles.subPillSelected]}
                    onPress={() => toggleSubcategory(s.value)}
                  >
                    <Text style={[styles.subPillText, active && styles.subPillTextSelected]}>
                      {s.label}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </ScrollView>

            <TouchableOpacity
              style={[styles.applyBtn, { backgroundColor: primaryColor }]}
              onPress={() => setSubcatModalFor(null)}
            >
              <Text style={styles.applyBtnText}>{t('common.apply')}</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  scrollView: { flexGrow: 0, flexShrink: 0, height: 44 },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 100,
    alignSelf: 'center',
    backgroundColor: 'rgba(30,38,64,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(30,38,64,0.12)',
  },
  pillText: { fontSize: 12, fontWeight: '500', color: 'rgba(30,38,64,0.6)' },
  pillTextSelected: { color: '#fff', fontWeight: '700' },
  // modal
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fcf6e3',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 36,
    paddingTop: 12,
    maxHeight: '75%',
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(30,38,64,0.2)',
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetTitle: { fontSize: 17, fontWeight: '800', color: '#1e2640', marginBottom: 4 },
  sheetHint: { fontSize: 12, color: 'rgba(30,38,64,0.4)', marginBottom: 16 },
  subGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  subPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 100,
    backgroundColor: 'rgba(30,38,64,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(30,38,64,0.12)',
  },
  subPillSelected: {
    backgroundColor: '#1e2640',
    borderColor: '#1e2640',
  },
  subPillText: { fontSize: 13, fontWeight: '500', color: 'rgba(30,38,64,0.7)' },
  subPillTextSelected: { color: '#fff', fontWeight: '700' },
  applyBtn: {
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 20,
  },
  applyBtnText: { color: '#fff', fontWeight: '800', fontSize: 15 },
})

