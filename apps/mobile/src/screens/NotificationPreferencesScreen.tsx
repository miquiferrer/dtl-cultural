import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { CategorySubcatSelector, type NotifPrefs } from '../components/CategorySubcatSelector'

const primaryColor = '#f4921e'

export function NotificationPreferencesScreen() {
  const { t } = useTranslation()
  const { session } = useAuth()
  const [notifyByEmail, setNotifyByEmail] = useState(false)
  const [prefs, setPrefs] = useState<NotifPrefs>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function loadPrefs() {
      if (!session?.user?.id) return
      const { data } = await supabase
        .from('app_users')
        .select('notify_by_email, notification_preferences')
        .eq('id', session.user.id)
        .single()
      if (data) {
        setNotifyByEmail(data.notify_by_email ?? false)
        setPrefs((data.notification_preferences as NotifPrefs) ?? {})
      }
      setLoading(false)
    }
    loadPrefs()
  }, [session?.user?.id])

  async function savePrefs() {
    if (!session?.user?.id) return
    setSaving(true)
    const { error } = await supabase
      .from('app_users')
      .update({
        notify_by_email: notifyByEmail,
        notification_preferences: notifyByEmail ? prefs : {},
      })
      .eq('id', session.user.id)
    setSaving(false)
    if (error) {
      Alert.alert('Error', error.message)
    } else {
      Alert.alert('', t('settings.saved'))
    }
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={primaryColor} />
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.description}>{t('settings.notifDesc')}</Text>

        {/* Email toggle */}
        <View style={styles.emailRow}>
          <Text style={styles.emailLabel}>{t('settings.notifEmail')}</Text>
          <Switch
            value={notifyByEmail}
            onValueChange={setNotifyByEmail}
            trackColor={{ false: 'rgba(30,38,64,0.15)', true: primaryColor }}
            thumbColor="#fff"
          />
        </View>

        {/* Category + subcategory selector */}
        {notifyByEmail && (
          <View style={styles.selectorSection}>
            <Text style={styles.sectionLabel}>{t('settings.selectCategories')}</Text>
            <CategorySubcatSelector
              value={prefs}
              onChange={setPrefs}
              primaryColor={primaryColor}
            />
          </View>
        )}

        <TouchableOpacity
          style={[styles.saveBtn, saving && { opacity: 0.6 }]}
          onPress={savePrefs}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveBtnText}>{t('common.save')}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcf6e3' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { padding: 20, paddingBottom: 48 },
  description: {
    fontSize: 14,
    color: 'rgba(30,38,64,0.6)',
    marginBottom: 20,
    lineHeight: 20,
  },
  emailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(30,38,64,0.08)',
  },
  emailLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e2640',
    flex: 1,
    marginRight: 8,
  },
  selectorSection: {
    marginBottom: 28,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(30,38,64,0.45)',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 14,
  },
  saveBtn: {
    backgroundColor: primaryColor,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: primaryColor,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
})

