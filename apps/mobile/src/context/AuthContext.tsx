import React, { createContext, useContext, useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextValue {
  session: Session | null
  loading: boolean
  needsPasswordReset: boolean
  clearPasswordReset: () => void
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  loading: true,
  needsPasswordReset: false,
  clearPasswordReset: () => {},
  signOut: async () => {},
})

// Module-level flag set by the deep-link handler before AuthProvider mounts
// (or while it's live). AuthProvider reads it on mount and subscribes to updates.
let _pendingPasswordReset = false
const _listeners = new Set<() => void>()

export function notifyPasswordRecovery() {
  _pendingPasswordReset = true
  _listeners.forEach((fn) => fn())
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [needsPasswordReset, setNeedsPasswordReset] = useState(_pendingPasswordReset)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    // Subscribe to password-recovery signals from the deep-link handler
    function onRecovery() {
      setNeedsPasswordReset(true)
      _pendingPasswordReset = false
    }
    _listeners.add(onRecovery)

    return () => {
      subscription.unsubscribe()
      _listeners.delete(onRecovery)
    }
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{
      session,
      loading,
      needsPasswordReset,
      clearPasswordReset: () => setNeedsPasswordReset(false),
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
