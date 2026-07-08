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
    return await api('/auth/signup', { method: 'POST', body: form })
  }

  const login = async (form) => {
    const res = await api('/auth/login', { method: 'POST', body: form })
    setUser(res.user)
    return res
  }

  const verify = async (email, code) => {
    const res = await api('/auth/verify', { method: 'POST', body: { email, code } })
    setUser(res.user)
    return res
  }

  const resend = async (email) => {
    return await api('/auth/resend', { method: 'POST', body: { email } })
  }

  const logout = async () => {
    await api('/auth/logout', { method: 'POST' })
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, ready, signup, login, logout, verify, resend }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
