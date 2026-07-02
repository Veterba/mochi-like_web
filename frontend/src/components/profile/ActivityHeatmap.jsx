import { dateKey } from "../../hooks/useActivity.js"

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

// GitHub/LeetCode-style grid: columns are weeks (Sun–Sat), covering the
// past ~year up to today. Cells after today are blank spacers.
function buildWeeks() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const start = new Date(today)
  start.setDate(start.getDate() - 364)
  start.setDate(start.getDate() - start.getDay()) // back to Sunday

  const weeks = []
  const cur = new Date(start)
  while (cur <= today) {
    const week = []
    for (let i = 0; i < 7; i++) {
      week.push(cur <= today ? new Date(cur) : null)
      cur.setDate(cur.getDate() + 1)
    }
    weeks.push(week)
  }
  return weeks
}

function ActivityHeatmap({ days }) {
  const active = new Set(days)
  const weeks = buildWeeks()

  // Label a column when the month of its first day changes.
  let lastMonth = -1
  const labels = weeks.map((week) => {
    const first = week.find(Boolean)
    const m = first ? first.getMonth() : lastMonth
    if (m !== lastMonth) {
      lastMonth = m
      return MONTHS[m]
    }
    return ""
  })

  return (
    <div className="border border-borders p-6">
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="text-sm uppercase tracking-widest text-gray">Activity</h3>
        <span className="text-xs text-gray">
          Total active days: <span className="text-text">{active.size}</span>
        </span>
      </div>

      <div className="overflow-x-auto">
        <div className="flex gap-1">
          {labels.map((l, i) => (
            <div key={i} className="w-3 whitespace-nowrap text-[10px] text-gray">
              {l}
            </div>
          ))}
        </div>
        <div className="mt-1 flex gap-1">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((day, di) =>
                day ? (
                  <div
                    key={di}
                    title={dateKey(day)}
                    className={`h-3 w-3 ${active.has(dateKey(day)) ? "bg-accent-3" : "bg-second-gray"}`}
                  />
                ) : (
                  <div key={di} className="h-3 w-3" />
                ),
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ActivityHeatmap
