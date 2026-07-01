import { useState } from "react"
import { XIcon } from "./Icons.jsx"

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function Shuffle({ topicName, cards, onClose }) {
  const [queue, setQueue] = useState(() => shuffleArray(cards))
  const [buffer, setBuffer] = useState([])
  const current = queue[0]

  // toBuffer = true -> marked red (don't know), re-queued for another pass.
  const advance = (toBuffer) => {
    const rest = queue.slice(1)
    const nextBuffer = toBuffer ? [...buffer, current] : buffer
    if (rest.length === 0 && nextBuffer.length > 0) {
      setQueue(shuffleArray(nextBuffer))
      setBuffer([])
    } else {
      setQueue(rest)
      setBuffer(nextBuffer)
    }
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg border border-borders bg-background p-8"
      >
        <button type="button" onClick={onClose} className="absolute right-4 top-4 text-text hover:text-gray">
          <XIcon />
        </button>
        <h3 className="mb-6 text-sm uppercase tracking-widest text-gray">Shuffle · {topicName}</h3>

        {current ? (
          <>
            <div className="flex aspect-[3/2] items-center justify-center border-2 border-borders text-xl font-bold">
              {current.label}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => advance(true)}
                className="border-2 border-accent-2 py-3 font-bold uppercase text-accent-2 hover:bg-accent-2 hover:text-background"
              >
                Don&apos;t know
              </button>
              <button
                type="button"
                onClick={() => advance(false)}
                className="border-2 border-accent-3 py-3 font-bold uppercase text-accent-3 hover:bg-accent-3 hover:text-background"
              >
                Know
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 py-10">
            <p className="text-lg font-bold uppercase">All cards known</p>
            <button
              type="button"
              onClick={onClose}
              className="border border-borders px-6 py-2 hover:bg-text hover:text-background"
            >
              Close
            </button>
          </div>
        )}

        {/* Buffer — cards marked red, shown until known */}
        <div className="mt-8 border-t border-borders pt-4">
          <span className="text-xs uppercase tracking-widest text-gray">Buffer · {buffer.length}</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {buffer.map((c) => (
              <span key={c.id} className="border border-accent-2 px-2 py-1 text-xs text-accent-2">
                {c.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Shuffle
