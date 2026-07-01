'use client'

import { createClient } from '@/lib/supabase/client'

export function LogoutButton() {
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-gray-500 hover:text-gray-700 transition"
    >
      Cerrar sesión
    </button>
  )
}
