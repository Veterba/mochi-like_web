import { useState, useEffect } from 'react'
import { useAuth } from './useAuth.jsx'
import { api } from '../api/client.js'

// Active-day tracker for the Profile heatmap. Stores local dates as
// "YYYY-MM-DD" strings; presence = the day was active (no counts).
const KEY = 'activity'

export function dateKey(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function readLocal() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || []
  } catch {
    return []
  }
}

export default function useActivity() {
  const { user } = useAuth()
  const [days, setDays] = useState(readLocal)

  useEffect(() => {
    if (user) {
      api('/activity').then(setDays).catch(() => {})
    } else {
      setDays(readLocal())
    }
  }, [user])

  useEffect(() => {
    if (!user) {
      localStorage.setItem(KEY, JSON.stringify(days))
    }
  }, [user, days])

  const markActiveToday = () => {
    const key = dateKey()
    setDays((prev) => (prev.includes(key) ? prev : [...prev, key]))
    if (user) {
      api('/activity', { method: 'POST' }).catch(() => {})
    }
  }

  return { days, markActiveToday }
}

// Marks today active once on mount. Keeps the effect out of components so
// their JSX stays presentational.
export function useMarkActiveToday() {
  const { markActiveToday } = useActivity()
  useEffect(() => {
    markActiveToday()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
