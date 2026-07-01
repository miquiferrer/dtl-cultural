import React, { useState } from 'react'
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { CategorySubcatSelector, type NotifPrefs } from '../components/CategorySubcatSelector'

const primaryColor = '#f4921e'

interface Props {
  onDone: () => void
}

export function OnboardingNotifScreen({ onDone }: Props) {
  const { t } = useTranslation()
  const { session } = useAuth()
  const [emailEnabled, setEmailEnabled] = useState(false)
  const [prefs, setPrefs] = useState<NotifPrefs>({})
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    if (!session?.user?.id) { onDone(); return }
    setSaving(true)
    await supabase
      .from('app_users')
      .update({
        notify_by_email: emailEnabled,
        notification_preferences: emailEnabled ? prefs : {},
      })
      .eq('id', session.user.id)
    setSaving(false)
    onDone()
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>{t('onboarding.title')}</Text>
        <Text style={styles.subtitle}>{t('onboarding.subtitle')}</Text>
        <Text style={styles.description}>{t('onboarding.description')}</Text>

        {/* Email toggle */}
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>{t('onboarding.emailToggle')}</Text>
          <Switch
            value={emailEnabled}
            onValueChange={setEmailEnabled}
            trackColor={{ false: 'rgba(30,38,64,0.15)', true: primaryColor }}
            thumbColor="#fff"
          />
        </View>

        {/* Category + subcategory selector */}
        {emailEnabled && (
          <View style={styles.selectorSection}>
            <Text style={styles.categoriesLabel}>{t('onboarding.categoriesLabel')}</Text>
            <CategorySubcatSelector
              value={prefs}
              onChange={setPrefs}
              primaryColor={primaryColor}
            />
          </View>
        )}

        {/* Actions */}
        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.85}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveBtnText}>{t('onboarding.saveButton')}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipBtn} onPress={onDone} disabled={saving}>
          <Text style={styles.skipBtnText}>{t('onboarding.skipButton')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcf6e3' },
  scroll: {
    flexGrow: 1,
    padding: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 20,
    marginTop: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1e2640',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '600',
    color: primaryColor,
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: 'rgba(30,38,64,0.6)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 28,
    paddingHorizontal: 8,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(30,38,64,0.08)',
    marginBottom: 16,
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e2640',
    flex: 1,
    marginRight: 12,
  },
  selectorSection: {
    width: '100%',
    marginBottom: 8,
  },
  categoriesLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(30,38,64,0.45)',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 14,
    alignSelf: 'flex-start',
  },
  saveBtn: {
    backgroundColor: primaryColor,
    paddingVertical: 15,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
    marginTop: 28,
    shadowColor: primaryColor,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  skipBtn: {
    marginTop: 14,
    paddingVertical: 10,
  },
  skipBtnText: {
    fontSize: 14,
    color: 'rgba(30,38,64,0.4)',
    fontWeight: '500',
  },
})

