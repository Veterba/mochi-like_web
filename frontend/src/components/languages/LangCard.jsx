import { Link } from "react-router-dom"

const dotColor = {
  learning: "bg-accent-1 border-accent-1",
  completed: "bg-accent-3 border-accent-3",
}
const badge = {
  learning: "border-accent-1 text-accent-1",
  completed: "border-accent-3 text-accent-3",
}

// Body click -> language page. Corner dot -> status popup.
function LangCard({ name, accent, status, onMark, available = true }) {
  if (!available) {
    return (
      <div
        className={`relative flex aspect-[4/3] items-center justify-center border-2 ${accent} px-4 text-center text-2xl font-bold uppercase tracking-tight opacity-40`}
      >
        {name}
        <span className="absolute bottom-2 left-2 text-[10px] uppercase tracking-widest text-gray">
          soon
        </span>
      </div>
    )
  }

  return (
    <div className={`group relative border-2 ${accent}`}>
      <Link
        to={`/languages/${name.toLowerCase()}`}
        className="flex aspect-[4/3] items-center justify-center px-4 text-center text-2xl font-bold uppercase tracking-tight hover:bg-text hover:text-background"
      >
        {name}
      </Link>
      <button
        type="button"
        onClick={onMark}
        aria-label={`mark ${name}`}
        title="mark"
        className={`absolute right-2 top-2 h-4 w-4 rounded-full border-2 ${
          status ? dotColor[status] : "border-borders bg-background"
        }`}
      />
      {status && (
        <span
          className={`absolute bottom-2 left-2 border px-2 py-0.5 text-[10px] uppercase tracking-widest ${badge[status]}`}
        >
          {status}
        </span>
      )}
    </div>
  )
}

export default LangCard
