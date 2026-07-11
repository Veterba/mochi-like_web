import { useState, useEffect } from "react"
import Navbar from "../sections/Navbar.jsx"
import ProfileHeader from "../components/profile/ProfileHeader.jsx"
import ProfileStats from "../components/profile/ProfileStats.jsx"
import ActivityHeatmap from "../components/profile/ActivityHeatmap.jsx"
import LearningList from "../components/profile/LearningList.jsx"
import SettingsModal from "../components/SettingsModal.jsx"
import { useAuth } from "../hooks/useAuth.jsx"
import useActivity, { dateKey } from "../hooks/useActivity.js"
import useLearning from "../hooks/useLearning.js"
import { api } from "../api/client.js"

// Consecutive active days ending today (or yesterday if today isn't marked).
function currentStreak(days) {
  const set = new Set(days)
  const d = new Date()
  if (!set.has(dateKey(d))) d.setDate(d.getDate() - 1)
  let streak = 0
  while (set.has(dateKey(d))) {
    streak++
    d.setDate(d.getDate() - 1)
  }
  return streak
}

function Profile() {
  const { user } = useAuth()
  const { days } = useActivity()
  const { statuses } = useLearning()
  const [showSettings, setShowSettings] = useState(false)
  const [flashStats, setFlashStats] = useState({ cardsAdded: 0, cardsLearned: 0 })

  useEffect(() => {
    if (user) {
      api("/flashcards/stats").then(setFlashStats).catch(() => {})
    } else {
      setFlashStats({ cardsAdded: 0, cardsLearned: 0 })
    }
  }, [user])

  const streak = currentStreak(days)
  const values = Object.values(statuses)
  const learning = values.filter((s) => s === "learning").length
  const completed = values.filter((s) => s === "completed").length

  return (
    <div className="min-h-screen bg-third-background">
      <Navbar sticky />
      <section className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 md:py-12">
        <ProfileHeader onSettings={() => setShowSettings(true)} />
        <ProfileStats
          streak={streak}
          activeDays={days.length}
          learning={learning}
          completed={completed}
          cardsAdded={flashStats.cardsAdded}
          cardsLearned={flashStats.cardsLearned}
        />
        <ActivityHeatmap days={days} />
        <LearningList statuses={statuses} />
      </section>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  )
}

export default Profile
