import { useState, useEffect } from "react"

// Shared identity (nickname + avatar) used by Profile and the Flashcards
// sidebar. Avatar is stored as a data URL.
const KEY = "profile"
const DEFAULT = { nickname: "Guest", avatar: null }

function read() {
  try {
    return { ...DEFAULT, ...(JSON.parse(localStorage.getItem(KEY)) || {}) }
  } catch {
    return DEFAULT
  }
}

export default function useProfile() {
  const [profile, setProfile] = useState(read)

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(profile))
  }, [profile])

  const update = (patch) => setProfile((p) => ({ ...p, ...patch }))

  return { ...profile, update }
}
