/* eslint-disable react/only-export-components -- context file exports both provider component and hook */
import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../api/client.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    api('/auth/me')
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setReady(true))
  }, [])

  const signup = async (form) => {
    const res = await api('/auth/signup', { method: 'POST', body: form })
    setUser(res.user)
    return res
  }

  const login = async (form) => {
    const res = await api('/auth/login', { method: 'POST', body: form })
    setUser(res.user)
    return res
  }

  const logout = async () => {
    await api('/auth/logout', { method: 'POST' })
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, ready, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
