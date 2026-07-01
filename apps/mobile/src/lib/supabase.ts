import { createClient as _createClient } from '@supabase/supabase-js'
import Constants from 'expo-constants'

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl as string
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey as string

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase config. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.',
  )
}

export const supabase = _createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false }, // mobile app users are anonymous
})
