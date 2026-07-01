import React, { useState, useCallback } from 'react'
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  TouchableOpacity,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useTranslation } from 'react-i18next'
import { useEvents } from '../hooks/useEvents'
import { CategoryFilter } from '../components/CategoryFilter'
import { EventCard } from '../components/EventCard'
import { DateFilter, getDateRange } from '../components/DateFilter'
import type { DateRange } from '../components/DateFilter'
import { LanguagePicker } from '../components/LanguagePicker'
import { useAuth } from '../context/AuthContext'
import type { Event, EventCategory, EventSubcategory } from '@dtl-cultural/shared'
import type { RootStackParamList } from '../../App'

const primaryColor = '#f4921e'

type NavProp = NativeStackNavigationProp<RootStackParamList>

function groupEventsByDate(events: Event[], todayLabel: string, upcomingLabel: string): { title: string; data: Event[] }[] {
  const today = new Date().toISOString().split('T')[0]
  const todayEvents = events.filter((e) => e.start_date === today)
  const upcomingEvents = events.filter((e) => e.start_date > today!)

  const sections: { title: string; data: Event[] }[] = []
  if (todayEvents.length > 0) sections.push({ title: todayLabel, data: todayEvents })
  if (upcomingEvents.length > 0) sections.push({ title: upcomingLabel, data: upcomingEvents })
  return sections
}

export function EventListScreen() {
  const navigation = useNavigation<NavProp>()
  const { t } = useTranslation()
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | null>(null)
  const [selectedSubcategories, setSelectedSubcategories] = useState<EventSubcategory[]>([])
  const [dateRange, setDateRange] = useState<DateRange>(getDateRange('all'))
  const [showLangPicker, setShowLangPicker] = useState(false)
  const { signOut } = useAuth()
  const { events, loading, error, refetch, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useEvents(selectedCategory, selectedSubcategories, dateRange.from, dateRange.to)
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }, [refetch])

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const sections = groupEventsByDate(events, t('events.today'), t('events.upcoming'))

  type ListItem = { type: 'header'; title: string } | { type: 'event'; event: Event }
  const listData: ListItem[] = sections.flatMap((section) => [
    { type: 'header' as const, title: section.title },
    ...section.data.map((event) => ({ type: 'event' as const, event })),
  ])

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fcf6e3" />

      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle} numberOfLines={1}>
          {t('app.title')}
        </Text>
        <TouchableOpacity
          onPress={() => setShowLangPicker(true)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={styles.langButton}
        >
          <Text style={styles.langButtonText}>🌐</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={signOut} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.signOutText}>{t('auth.signOut')}</Text>
        </TouchableOpacity>
      </View>

      {/* Date + Category filter row */}
      <View style={styles.filterRow}>
        <DateFilter
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          primaryColor={primaryColor}
        />
        <CategoryFilter
          selectedCategory={selectedCategory}
          selectedSubcategories={selectedSubcategories}
          onCategoryChange={(cat) => {
            setSelectedCategory(cat)
            setSelectedSubcategories([])
          }}
          onSubcategoriesChange={setSelectedSubcategories}
          primaryColor={primaryColor}
        />
      </View>

      {/* Event list */}
      {loading && !refreshing ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={primaryColor} />
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : listData.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>{t('events.noResults')}</Text>
        </View>
      ) : (
        <FlatList
          data={listData}
          keyExtractor={(item, index) =>
            item.type === 'header' ? `header-${index}` : item.event.id
          }
          renderItem={({ item }) => {
            if (item.type === 'header') {
              return <Text style={styles.sectionHeader}>{item.title}</Text>
            }
            return (
              <EventCard
                event={item.event}
                onPress={() => navigation.navigate('EventDetail', { eventId: item.event.id })}
              />
            )
          }}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator size="small" color={primaryColor} style={styles.footer} />
            ) : null
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={primaryColor} />
          }
          contentContainerStyle={styles.listContent}
        />
      )}

      <LanguagePicker
        visible={showLangPicker}
        onClose={() => setShowLangPicker(false)}
        primaryColor={primaryColor}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcf6e3',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fcf6e3',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
    gap: 8,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  logo: {
    width: 40,
    height: 40,
  },
  headerTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
    color: '#1e2640',
    textAlign: 'center',
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(30,38,64,0.45)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    color: '#f87171',
    textAlign: 'center',
    fontSize: 14,
  },
  emptyText: {
    color: 'rgba(30,38,64,0.45)',
    textAlign: 'center',
    fontSize: 15,
  },
  footer: {
    paddingVertical: 16,
  },
  signOutText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(30,38,64,0.45)',
  },
  langButton: {
    padding: 2,
  },
  langButtonText: {
    fontSize: 18,
  },
})


