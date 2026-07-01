import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'
import Constants from 'expo-constants'
import { supabase } from './supabase'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
})

export async function registerForPushNotifications(): Promise<string | null> {
  if (Platform.OS === 'web') return null

  // expo-notifications remote push support was removed from Expo Go in SDK 53.
  // Skip registration entirely when running inside the Expo Go client.
  if (Constants.executionEnvironment === 'storeClient') return null

  const projectId = Constants.expoConfig?.extra?.eas?.projectId as string | undefined
  if (!projectId) return null

  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }

  if (finalStatus !== 'granted') {
    return null
  }

  const citySlug = Constants.expoConfig?.extra?.citySlug as string

  const token = (
    await Notifications.getExpoPushTokenAsync({ projectId })
  ).data

  // Save token to Supabase (upsert — device_token is unique)
  await supabase.from('push_tokens').upsert(
    { device_token: token, city_slug: citySlug },
    { onConflict: 'device_token' },
  )

  return token
}
