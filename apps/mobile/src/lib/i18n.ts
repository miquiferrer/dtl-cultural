import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as FileSystem from 'expo-file-system'
import commonEs from '../locales/es/common.json'
import commonCa from '../locales/ca/common.json'
import commonEn from '../locales/en/common.json'
import commonFr from '../locales/fr/common.json'

const LANG_FILE = (FileSystem.documentDirectory ?? '') + '.lang'

export async function loadSavedLanguage(): Promise<string> {
  try {
    const info = await FileSystem.getInfoAsync(LANG_FILE)
    if (info.exists) {
      const lang = await FileSystem.readAsStringAsync(LANG_FILE)
      return lang.trim()
    }
  } catch {}
  return 'es'
}

export async function saveLanguage(lang: string): Promise<void> {
  try {
    await FileSystem.writeAsStringAsync(LANG_FILE, lang)
  } catch {}
}

i18n.use(initReactI18next).init({
  resources: {
    es: { common: commonEs },
    ca: { common: commonCa },
    en: { common: commonEn },
    fr: { common: commonFr },
  },
  lng: 'es',
  fallbackLng: 'es',
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
})

// Apply saved language preference asynchronously
loadSavedLanguage().then((lang) => {
  if (lang !== i18n.language) {
    i18n.changeLanguage(lang)
  }
})

export default i18n
