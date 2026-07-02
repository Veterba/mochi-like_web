import { useState, useEffect } from "react"

// Active-day tracker for the Profile heatmap. Stores local dates as
// "YYYY-MM-DD" strings; presence = the day was active (no counts).
const KEY = "activity"

export function dateKey(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || []
  } catch {
    return []
  }
}

export default function useActivity() {
  const [days, setDays] = useState(read)

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(days))
  }, [days])

  const markActiveToday = () =>
    setDays((prev) => (prev.includes(dateKey()) ? prev : [...prev, dateKey()]))

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
