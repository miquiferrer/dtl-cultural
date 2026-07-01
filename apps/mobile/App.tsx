import './src/lib/i18n' // must be imported before any screen
import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { View, Text, Image } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import * as Linking from 'expo-linking'
import { EventListScreen } from './src/screens/EventListScreen'
import { EventDetailScreen } from './src/screens/EventDetailScreen'
import { MapScreen } from './src/screens/MapScreen'
import { LoginScreen } from './src/screens/LoginScreen'
import { RegisterScreen } from './src/screens/RegisterScreen'
import { ResetPasswordScreen } from './src/screens/ResetPasswordScreen'
import { SettingsScreen } from './src/screens/SettingsScreen'
import { NotificationPreferencesScreen } from './src/screens/NotificationPreferencesScreen'
import { OnboardingNotifScreen } from './src/screens/OnboardingNotifScreen'
import { AuthProvider, useAuth, notifyPasswordRecovery } from './src/context/AuthContext'
import { registerForPushNotifications } from './src/lib/notifications'
import { supabase } from './src/lib/supabase'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 min — don't refetch if data is fresh
      retry: 2,
    },
  },
})

// ─── Navigation types ─────────────────────────────────────────
export type RootStackParamList = {
  Tabs: undefined
  EventDetail: { eventId: string }
  NotificationPreferences: undefined
}

type TabParamList = {
  EventList: undefined
  Map: undefined
  Settings: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()
const Tab = createBottomTabNavigator<TabParamList>()

function TabNavigator() {
  const { t } = useTranslation()
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#f4921e',
        tabBarInactiveTintColor: 'rgba(30,38,64,0.35)',
        tabBarStyle: {
          backgroundColor: '#fcf6e3',
          borderTopColor: 'rgba(30,38,64,0.08)',
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name="EventList"
        component={EventListScreen}
        options={{
          title: t('nav.events'),
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>📅</Text>,
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          title: t('nav.map'),
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>🗺️</Text>,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: t('nav.settings'),
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 18, color }}>⚙️</Text>,
        }}
      />
    </Tab.Navigator>
  )
}

// ─── Auth gate: shows login/register until the user is signed in ───
function AppNavigator() {
  const { session, loading, needsPasswordReset, clearPasswordReset } = useAuth()
  const [showRegister, setShowRegister] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)

  // While AuthContext resolves the initial session, keep showing splash
  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#fcf6e3', alignItems: 'center', justifyContent: 'center' }}>
        <Image source={require('./assets/logo.png')} style={{ width: 120, height: 120 }} resizeMode="contain" />
      </View>
    )
  }

  if (needsPasswordReset) {
    return (
      <ResetPasswordScreen
        onDone={() => {
          clearPasswordReset()
          supabase.auth.signOut()
        }}
      />
    )
  }

  if (!session) {
    return showRegister ? (
      <RegisterScreen
        onGoToLogin={() => setShowRegister(false)}
        onRegistered={() => setShowOnboarding(true)}
      />
    ) : (
      <LoginScreen onGoToRegister={() => setShowRegister(true)} />
    )
  }

  // Show onboarding immediately after a fresh registration
  if (showOnboarding) {
    return <OnboardingNotifScreen onDone={() => setShowOnboarding(false)} />
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={TabNavigator} />
        <Stack.Screen name="EventDetail" component={EventDetailScreen} />
        <Stack.Screen
          name="NotificationPreferences"
          component={NotificationPreferencesScreen}
          options={{
            headerShown: true,
            headerTitle: '',
            headerBackTitle: '',
            headerStyle: { backgroundColor: '#fcf6e3' },
            headerShadowVisible: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

// Parses the recovery URL (dtlcultural://reset-password#access_token=...&type=recovery)
// and hands the tokens to Supabase, then signals AuthContext to show the reset form.
// Supabase puts tokens in the URL fragment; expo-linking surfaces these as queryParams
// on web but on native Android the fragment arrives as a raw string — parse both.
async function handleDeepLink(rawUrl: string) {
  const url = decodeURIComponent(rawUrl)
  console.log('[DeepLink] received:', url)

  const parsed = Linking.parse(url)
  let params = (parsed.queryParams as Record<string, string>) ?? {}

  // Supabase puts tokens in the fragment; parse it manually as expo-linking
  // does not surface fragment params on native.
  const hashIndex = url.indexOf('#')
  if (hashIndex !== -1) {
    const fragment = url.slice(hashIndex + 1)
    const fragmentParams = Object.fromEntries(
      fragment.split('&').map((p) => p.split('=').map(decodeURIComponent))
    )
    params = { ...fragmentParams, ...params }
  }

  console.log('[DeepLink] params:', params)
  const { access_token, refresh_token, type } = params
  if (type === 'recovery' && access_token) {
    notifyPasswordRecovery()
    await supabase.auth.setSession({ access_token, refresh_token: refresh_token ?? '' })
  }
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    registerForPushNotifications().catch(console.warn)
    const timer = setTimeout(() => setShowSplash(false), 2000)

    // Handle deep link that opens the app from the password-reset email.
    // Supabase appends #access_token=...&type=recovery to the redirect URL.
    // expo-linking normalises the fragment into query params for us.
    async function handleInitialUrl() {
      const url = await Linking.getInitialURL()
      if (url) handleDeepLink(url)
    }
    handleInitialUrl()

    const sub = Linking.addEventListener('url', ({ url }) => handleDeepLink(url))
    return () => {
      clearTimeout(timer)
      sub.remove()
    }
  }, [])

  return (
    <SafeAreaProvider>
      {showSplash ? (
        <View style={{ flex: 1, backgroundColor: '#fcf6e3', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
          <Image
            source={require('./assets/logo.png')}
            style={{ width: 180, height: 180 }}
            resizeMode="contain"
          />
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#1e2640', letterSpacing: -0.3 }}>
            Agenda Cultural de Terrassa
          </Text>
        </View>
      ) : (
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <AppNavigator />
          </AuthProvider>
        </QueryClientProvider>
      )}
    </SafeAreaProvider>
  )
}

