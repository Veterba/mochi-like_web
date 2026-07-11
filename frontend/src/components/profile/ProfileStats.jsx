import { useTranslation } from "react-i18next"

function StatCard({ label, value, color }) {
  return (
    <div className="flex flex-col items-center border border-borders p-3 text-center">
      <span className={`text-xl font-black ${color || "text-text"}`}>{value}</span>
      <span className="mt-1 text-[9px] font-bold uppercase tracking-widest text-gray">{label}</span>
    </div>
  )
}

function ProfileStats({ streak, activeDays, learning, completed, cardsAdded, cardsLearned }) {
  const { t } = useTranslation()

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      <StatCard label={t("profile.stats.dayStreak")} value={streak} color="text-accent-1" />
      <StatCard label={t("profile.stats.activeDays")} value={activeDays} color="text-accent-3" />
      <StatCard label={t("profile.stats.learning")} value={learning} />
      <StatCard label={t("profile.stats.completed")} value={completed} color="text-accent-3" />
      <StatCard label={t("profile.stats.cardsAdded")} value={cardsAdded} />
      <StatCard label={t("profile.stats.cardsLearned")} value={cardsLearned} color="text-accent-1" />
    </div>
  )
}

export default ProfileStats
