import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { ensureUserProfile } from '../lib/profile'

const AuthContext = createContext(null)

function getInitials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
      if (session?.user) ensureUserProfile(session.user).catch(console.error)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session?.user) ensureUserProfile(session.user).catch(console.error)
    })

    return () => subscription.unsubscribe()
  }, [])

  const isLoggedIn = !!session

  const user = session
    ? {
        name: session.user.user_metadata?.full_name ?? session.user.email,
        email: session.user.email,
        initials: getInitials(session.user.user_metadata?.full_name ?? session.user.email),
        role: session.user.user_metadata?.role ?? 'employee',
        business: session.user.user_metadata?.businessName ?? '',
      }
    : null

  const logout = () => supabase.auth.signOut()

  return (
    <AuthContext.Provider value={{ session, user, isLoggedIn, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
