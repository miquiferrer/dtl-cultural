import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useTranslation } from 'react-i18next'
import { LanguagePicker } from '../components/LanguagePicker'
import { useAuth } from '../context/AuthContext'
import type { RootStackParamList } from '../../App'

const primaryColor = '#f4921e'

type NavProp = NativeStackNavigationProp<RootStackParamList>

export function SettingsScreen() {
  const { t, i18n } = useTranslation()
  const navigation = useNavigation<NavProp>()
  const { signOut } = useAuth()
  const [showLangPicker, setShowLangPicker] = useState(false)

  const LANG_NAMES: Record<string, string> = {
    es: 'Español',
    ca: 'Català',
    en: 'English',
    fr: 'Français',
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Language */}
        <Text style={styles.sectionLabel}>{t('settings.languageLabel')}</Text>
        <TouchableOpacity style={styles.row} onPress={() => setShowLangPicker(true)}>
          <Text style={styles.rowIcon}>🌐</Text>
          <View style={styles.rowContent}>
            <Text style={styles.rowTitle}>{t('settings.languageLabel')}</Text>
            <Text style={styles.rowValue}>{LANG_NAMES[i18n.language] ?? i18n.language.toUpperCase()}</Text>
          </View>
          <Text style={styles.rowArrow}>›</Text>
        </TouchableOpacity>

        {/* Notification preferences */}
        <Text style={[styles.sectionLabel, { marginTop: 24 }]}>{t('settings.notifications')}</Text>
        <TouchableOpacity
          style={styles.row}
          onPress={() => navigation.navigate('NotificationPreferences')}
        >
          <Text style={styles.rowIcon}>🔔</Text>
          <View style={styles.rowContent}>
            <Text style={styles.rowTitle}>{t('settings.notifications')}</Text>
            <Text style={styles.rowValue}>{t('settings.notifDesc')}</Text>
          </View>
          <Text style={styles.rowArrow}>›</Text>
        </TouchableOpacity>

        {/* Sign out */}
        <TouchableOpacity style={[styles.row, styles.signOutRow, { marginTop: 32 }]} onPress={signOut}>
          <Text style={styles.signOutText}>{t('auth.signOut')}</Text>
        </TouchableOpacity>

      </ScrollView>

      <LanguagePicker
        visible={showLangPicker}
        onClose={() => setShowLangPicker(false)}
        primaryColor={primaryColor}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcf6e3' },
  scroll: { padding: 20, paddingBottom: 40 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(30,38,64,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(30,38,64,0.08)',
    marginBottom: 8,
  },
  rowIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  rowContent: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e2640',
  },
  rowValue: {
    fontSize: 12,
    color: 'rgba(30,38,64,0.45)',
    marginTop: 2,
  },
  rowArrow: {
    fontSize: 22,
    color: 'rgba(30,38,64,0.25)',
    marginLeft: 8,
  },
  signOutRow: {
    justifyContent: 'center',
    borderColor: 'rgba(244,74,30,0.2)',
  },
  signOutText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#e8463a',
  },
})
