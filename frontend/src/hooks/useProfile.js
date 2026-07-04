import { useState, useEffect } from 'react'
import { useAuth } from './useAuth.jsx'
import { api } from '../api/client.js'

// Shared identity (nickname + avatar) used by Profile and the Flashcards
// sidebar. Avatar is stored as a data URL.
const KEY = 'profile'
const DEFAULT = { nickname: 'Guest', avatar: null }

function readLocal() {
  try {
    return { ...DEFAULT, ...(JSON.parse(localStorage.getItem(KEY)) || {}) }
  } catch {
    return DEFAULT
  }
}

export default function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(() =>
    user ? { nickname: user.nickname ?? DEFAULT.nickname, avatar: user.avatar ?? null } : readLocal()
  )

  useEffect(() => {
    if (user) {
      setProfile({ nickname: user.nickname ?? DEFAULT.nickname, avatar: user.avatar ?? null })
    } else {
      setProfile(readLocal())
    }
  }, [user])

  useEffect(() => {
    if (!user) {
      localStorage.setItem(KEY, JSON.stringify(profile))
    }
  }, [user, profile])

  const update = async (patch) => {
    if (user) {
      const updated = await api('/profile', { method: 'PATCH', body: patch })
      setProfile((p) => ({ ...p, ...updated }))
    } else {
      setProfile((p) => ({ ...p, ...patch }))
    }
  }

  return { ...profile, update }
}
