import { useState, useEffect } from "react"

// Per-language learning status shared across Languages + Profile pages.
// Shape: { [languageName]: "learning" | "completed" }
const KEY = "learning"

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {}
  } catch {
    return {}
  }
}

export default function useLearning() {
  const [statuses, setStatuses] = useState(read)

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(statuses))
  }, [statuses])

  const setStatus = (lang, status) =>
    setStatuses((prev) => ({ ...prev, [lang]: status }))

  const remove = (lang) =>
    setStatuses((prev) => {
      const next = { ...prev }
      delete next[lang]
      return next
    })

  return { statuses, setStatus, remove }
}
