import { createContext, useContext, useState } from 'react'

const defaultUser = {
  name: 'ישראל ישראלי',
  business: 'שיפודיית ישראל',
  initials: 'יש',
  role: 'admin',
  email: 'israel.i@stocksimple.co.il',
}

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(defaultUser)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const login = () => setIsLoggedIn(true)
  const logout = () => setIsLoggedIn(false)

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
