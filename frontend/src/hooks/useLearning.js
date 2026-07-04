import { useState, useEffect } from 'react'
import { useAuth } from './useAuth.jsx'
import { api } from '../api/client.js'

// Per-language learning status shared across Languages + Profile pages.
// Shape: { [languageName]: "learning" | "completed" }
const KEY = 'learning'

function readLocal() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {}
  } catch {
    return {}
  }
}

export default function useLearning() {
  const { user } = useAuth()
  const [statuses, setStatuses] = useState(readLocal)

  useEffect(() => {
    if (user) {
      api('/learning')
        .then((arr) => setStatuses(Object.fromEntries(arr.map((r) => [r.language, r.status]))))
        .catch(() => {})
    } else {
      setStatuses(readLocal())
    }
  }, [user])

  useEffect(() => {
    if (!user) {
      localStorage.setItem(KEY, JSON.stringify(statuses))
    }
  }, [user, statuses])

  const setStatus = (lang, status) => {
    setStatuses((prev) => ({ ...prev, [lang]: status }))
    if (user) {
      api(`/learning/${encodeURIComponent(lang)}`, { method: 'PUT', body: { status } }).catch(() => {})
    }
  }

  const remove = (lang) => {
    setStatuses((prev) => {
      const next = { ...prev }
      delete next[lang]
      return next
    })
    if (user) {
      api(`/learning/${encodeURIComponent(lang)}`, { method: 'DELETE' }).catch(() => {})
    }
  }

  return { statuses, setStatus, remove }
}
