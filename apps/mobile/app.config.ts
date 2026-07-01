import type { ExpoConfig, ConfigContext } from 'expo/config'

// City-specific configuration injected at build time via EAS env vars
const citySlug = process.env.EXPO_PUBLIC_CITY_SLUG ?? 'terrassa'
const cityName = process.env.EXPO_PUBLIC_CITY_NAME ?? 'Terrassa'
const appName = process.env.EXPO_PUBLIC_APP_NAME ?? 'Agenda Cultural de Terrassa'

// Per-city package/bundle ID overrides to match store listings
const packageOverrides: Record<string, string> = {
  terrassa: 'com.zeralion.agendaterrassa',
}
const androidPackage = packageOverrides[citySlug] ?? `com.dtlcultural.${citySlug}`
const iosBundleId = packageOverrides[citySlug] ?? `com.dtlcultural.${citySlug}`

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  owner: 'miquelf',
  name: appName,
  slug: `dtl-cultural-${citySlug}`,
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  newArchEnabled: true,
  splash: {
    image: './assets/logo.png',
    resizeMode: 'contain',
    backgroundColor: '#fcf6e3',
  },
  ios: {
    supportsTablet: false,
    bundleIdentifier: iosBundleId,
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      ...(process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY
        ? { GMSApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY }
        : {}),
    },
  },
  android: {
    package: androidPackage,
    versionCode: 11,
    config: {
      googleMaps: {
        apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY,
      },
    },
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    edgeToEdgeEnabled: true,
    ...(process.env.GOOGLE_SERVICES_JSON
      ? { googleServicesFile: process.env.GOOGLE_SERVICES_JSON }
      : {}),
  },
  web: {
    favicon: './assets/favicon.png',
  },
  scheme: 'dtlcultural',
  extra: {
    citySlug,
    cityName,
    supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY,
    eas: {
      projectId: process.env.EAS_PROJECT_ID ?? '001c470e-6893-482d-a1a2-8b1fd7c11200',
    },
  },
  plugins: [
    [
      'expo-notifications',
      {
        icon: './assets/notification-icon.png',
        color: '#ffffff',
      },
    ],
    [
      '@stripe/stripe-react-native',
      {
        merchantIdentifier: `merchant.${iosBundleId}`,
        enableGooglePay: true,
      },
    ],
    'expo-image-picker',
    'expo-location',
  ],
})
