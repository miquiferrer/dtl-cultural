import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  StyleSheet,
} from 'react-native'
import { useTranslation } from 'react-i18next'

export interface DateRange {
  from: string | null // YYYY-MM-DD
  to: string | null   // YYYY-MM-DD
  preset: DatePreset
}

export type DatePreset = 'all' | 'today' | 'weekend' | 'thisWeek' | 'next7Days' | 'thisMonth'

function pad(n: number) {
  return String(n).padStart(2, '0')
}
function toISO(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function getDateRange(preset: DatePreset): DateRange {
  const today = new Date()
  const todayStr = toISO(today)
  const day = today.getDay() // 0=Sun, 6=Sat

  switch (preset) {
    case 'all':
      return { from: null, to: null, preset }
    case 'today':
      return { from: todayStr, to: todayStr, preset }
    case 'weekend': {
      // Sat of this/next weekend
      let sat: Date
      if (day === 6) {
        sat = new Date(today)
      } else if (day === 0) {
        sat = new Date(today)
        sat.setDate(today.getDate() - 1)
      } else {
        sat = new Date(today)
        sat.setDate(today.getDate() + (6 - day))
      }
      const sun = new Date(sat)
      sun.setDate(sat.getDate() + (day === 0 ? 0 : 1))
      return { from: toISO(sat), to: toISO(sun), preset }
    }
    case 'thisWeek': {
      // Monday to Sunday of current week
      const mon = new Date(today)
      mon.setDate(today.getDate() - (day === 0 ? 6 : day - 1))
      const sun = new Date(mon)
      sun.setDate(mon.getDate() + 6)
      return { from: toISO(mon), to: toISO(sun), preset }
    }
    case 'next7Days': {
      const end = new Date(today)
      end.setDate(today.getDate() + 6)
      return { from: todayStr, to: toISO(end), preset }
    }
    case 'thisMonth': {
      const first = new Date(today.getFullYear(), today.getMonth(), 1)
      const last = new Date(today.getFullYear(), today.getMonth() + 1, 0)
      return { from: toISO(first), to: toISO(last), preset }
    }
    default:
      return { from: todayStr, to: null, preset: 'all' }
  }
}

interface Props {
  dateRange: DateRange
  onDateRangeChange: (range: DateRange) => void
  primaryColor?: string
}

export function DateFilter({ dateRange, onDateRangeChange, primaryColor = '#f4921e' }: Props) {
  const { t } = useTranslation()
  const [modalVisible, setModalVisible] = useState(false)

  const PRESETS: { key: DatePreset; labelKey: string }[] = [
    { key: 'all', labelKey: 'dateFilter.all' },
    { key: 'today', labelKey: 'dateFilter.today' },
    { key: 'weekend', labelKey: 'dateFilter.weekend' },
    { key: 'thisWeek', labelKey: 'dateFilter.thisWeek' },
    { key: 'next7Days', labelKey: 'dateFilter.next7Days' },
    { key: 'thisMonth', labelKey: 'dateFilter.thisMonth' },
  ]

  const isFiltered = dateRange.preset !== 'all'
  const activeLabel = isFiltered ? t(`dateFilter.${dateRange.preset}`) : t('dateFilter.label')

  function selectPreset(preset: DatePreset) {
    onDateRangeChange(getDateRange(preset))
    setModalVisible(false)
  }

  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={[
          styles.button,
          isFiltered && { backgroundColor: primaryColor, borderColor: primaryColor },
        ]}
      >
        <Text style={[styles.buttonText, isFiltered && styles.buttonTextActive]}>
          📅 {activeLabel}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setModalVisible(false)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.handle} />
            <Text style={styles.sheetTitle}>{t('dateFilter.label')}</Text>
            {PRESETS.map(({ key, labelKey }) => {
              const isSelected = dateRange.preset === key
              return (
                <TouchableOpacity
                  key={key}
                  style={[styles.option, isSelected && { borderColor: primaryColor }]}
                  onPress={() => selectPreset(key)}
                >
                  <Text style={[styles.optionText, isSelected && { color: primaryColor, fontWeight: '700' }]}>
                    {t(labelKey)}
                  </Text>
                  {isSelected && <Text style={[styles.check, { color: primaryColor }]}>✓</Text>}
                </TouchableOpacity>
              )
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(30,38,64,0.12)',
    backgroundColor: 'rgba(30,38,64,0.07)',
    alignSelf: 'center',
    marginLeft: 16,
    marginRight: 4,
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(30,38,64,0.6)',
  },
  buttonTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fcf6e3',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 36,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(30,38,64,0.15)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1e2640',
    marginBottom: 14,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(30,38,64,0.1)',
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  optionText: {
    fontSize: 15,
    color: '#1e2640',
    fontWeight: '500',
  },
  check: {
    fontSize: 17,
    fontWeight: '700',
  },
})
