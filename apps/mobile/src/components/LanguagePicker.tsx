import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  StyleSheet,
} from 'react-native'
import { useTranslation } from 'react-i18next'
import { saveLanguage } from '../lib/i18n'

const LANGUAGES = [
  { code: 'es', label: 'Español', abbr: 'ES' },
  { code: 'ca', label: 'Català', abbr: 'CA' },
  { code: 'en', label: 'English', abbr: 'EN' },
  { code: 'fr', label: 'Français', abbr: 'FR' },
]

interface Props {
  visible: boolean
  onClose: () => void
  primaryColor?: string
}

export function LanguagePicker({ visible, onClose, primaryColor = '#f4921e' }: Props) {
  const { i18n } = useTranslation()

  async function selectLanguage(code: string) {
    await i18n.changeLanguage(code)
    await saveLanguage(code)
    onClose()
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />
          <Text style={styles.title}>Idioma / Language</Text>
          {LANGUAGES.map((lang) => {
            const isSelected = i18n.language === lang.code
            return (
              <TouchableOpacity
                key={lang.code}
                style={[styles.option, isSelected && { borderColor: primaryColor }]}
                onPress={() => selectLanguage(lang.code)}
              >
                <View style={[styles.abbr, isSelected && { backgroundColor: primaryColor }]}>
                  <Text style={[styles.abbrText, isSelected && styles.abbrTextSelected]}>
                    {lang.abbr}
                  </Text>
                </View>
                <Text style={[styles.label, isSelected && { color: primaryColor }]}>
                  {lang.label}
                </Text>
                {isSelected && <Text style={[styles.check, { color: primaryColor }]}>✓</Text>}
              </TouchableOpacity>
            )
          })}
        </Pressable>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
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
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e2640',
    marginBottom: 16,
    textAlign: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(30,38,64,0.1)',
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  abbr: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(30,38,64,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  abbrText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e2640',
  },
  abbrTextSelected: {
    color: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e2640',
    flex: 1,
  },
  check: {
    fontSize: 18,
    fontWeight: '700',
  },
})
