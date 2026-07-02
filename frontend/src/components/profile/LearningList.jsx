import { Link } from "react-router-dom"

function LearningList({ statuses }) {
  const entries = Object.entries(statuses)
  const learning = entries.filter(([, s]) => s === "learning")
  const completed = entries.filter(([, s]) => s === "completed")

  return (
    <div className="border border-borders p-6">
      <h3 className="mb-4 text-sm uppercase tracking-widest text-gray">Learning</h3>
      {entries.length === 0 ? (
        <p className="text-sm text-gray">
          Nothing yet.{" "}
          <Link to="/languages" className="underline">
            Pick a language →
          </Link>
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-accent-1">
              Currently learning · {learning.length}
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              {learning.map(([name]) => (
                <Link
                  key={name}
                  to={`/languages/${name.toLowerCase()}`}
                  className="border border-accent-1 px-3 py-1 text-sm text-accent-1"
                >
                  {name}
                </Link>
              ))}
            </div>
          </div>
          {completed.length > 0 && (
            <div>
              <span className="text-xs uppercase tracking-widest text-accent-3">
                Completed · {completed.length}
              </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {completed.map(([name]) => (
                  <Link
                    key={name}
                    to={`/languages/${name.toLowerCase()}`}
                    className="border border-accent-3 px-3 py-1 text-sm text-accent-3"
                  >
                    {name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default LearningList
