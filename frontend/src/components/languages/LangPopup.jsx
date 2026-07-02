import { Link } from "react-router-dom"
import { XIcon } from "../flashcards/Icons.jsx"

function LangPopup({ name, accent, status, onSetStatus, onRemove, onClose }) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm border border-borders bg-background p-8"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-text hover:text-gray"
        >
          <XIcon />
        </button>

        <div
          className={`mb-6 flex aspect-[4/3] items-center justify-center border-2 ${accent} text-3xl font-bold uppercase tracking-tight`}
        >
          {name}
        </div>
        {status && (
          <p className="mb-4 text-center text-xs uppercase tracking-widest text-gray">
            status · {status}
          </p>
        )}

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => onSetStatus("learning")}
            className="border border-borders px-4 py-2 text-sm uppercase hover:bg-text hover:text-background"
          >
            Target as currently learning
          </button>
          <button
            type="button"
            onClick={() => onSetStatus("completed")}
            className="border border-borders px-4 py-2 text-sm uppercase hover:bg-text hover:text-background"
          >
            Complete learning
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="border border-accent-2 px-4 py-2 text-sm uppercase text-accent-2 hover:bg-accent-2 hover:text-background"
          >
            Delete from learning
          </button>
          <Link
            to={`/languages/${name.toLowerCase()}`}
            className="mt-2 text-center text-xs uppercase tracking-widest text-gray underline-offset-2 hover:underline"
          >
            Open language page →
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LangPopup
