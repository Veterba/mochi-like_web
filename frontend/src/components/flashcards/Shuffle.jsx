import { useRef, useState } from "react"
import { XIcon } from "./Icons.jsx"

const THRESHOLD = 120 // px to commit a swipe
const CLICK_MAX = 6 // px under which a release counts as a click (flip)

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
  const [flipped, setFlipped] = useState(false)
  const [dx, setDx] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [animating, setAnimating] = useState(false)
  const dragging = useRef(false)
  const startX = useRef(0)
  const current = queue[0]

  // toBuffer = true -> marked red (don't know), re-queued for another pass.
  // Fly the current card off-screen, then swap in the next one.
  const commit = (toBuffer) => {
    setAnimating(true)
    setDx(toBuffer ? -800 : 800)
    setTimeout(() => {
      const rest = queue.slice(1)
      const nextBuffer = toBuffer ? [...buffer, current] : buffer
      if (rest.length === 0 && nextBuffer.length > 0) {
        setQueue(shuffleArray(nextBuffer))
        setBuffer([])
      } else {
        setQueue(rest)
        setBuffer(nextBuffer)
      }
      setFlipped(false)
      setDx(0)
      setAnimating(false)
    }, 350)
  }

  const onPointerDown = (e) => {
    if (animating) return
    dragging.current = true
    setIsDragging(true)
    startX.current = e.clientX
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e) => {
    if (!dragging.current) return
    setDx(e.clientX - startX.current)
  }
  const onPointerUp = () => {
    if (!dragging.current) return
    dragging.current = false
    setIsDragging(false)
    if (dx > THRESHOLD) commit(false) // know
    else if (dx < -THRESHOLD) commit(true) // don't know
    else if (Math.abs(dx) < CLICK_MAX) {
      setFlipped((f) => !f)
      setDx(0)
    } else setDx(0)
  }

  const intent = dx > 40 ? "know" : dx < -40 ? "dont" : null
  const borderColor =
    intent === "know" ? "border-accent-3" : intent === "dont" ? "border-accent-2" : "border-borders"
  // Fill the card with the side color, proportional to how far it's pulled.
  const tint = Math.min(Math.abs(dx) / THRESHOLD, 1)
  const fill = dx > 0 ? `rgba(79,104,21,${tint})` : dx < 0 ? `rgba(163,30,33,${tint})` : "transparent"

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
            <div className="mb-2 flex justify-between text-xs font-bold uppercase">
              <span className={intent === "dont" ? "text-accent-2" : "text-gray"}>← Don&apos;t know</span>
              <span className={intent === "know" ? "text-accent-3" : "text-gray"}>Know →</span>
            </div>
            <div
              key={current.id}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              style={{
                transform: `translateX(${dx}px) rotate(${dx * 0.04}deg)`,
                transition: isDragging ? "background-color 0.08s linear" : "transform 0.35s ease, background-color 0.2s",
                backgroundColor: fill,
                color: tint > 0.5 ? "#F9F7F5" : undefined,
                touchAction: "none",
              }}
              className={`flex aspect-[3/2] cursor-grab select-none items-center justify-center border-2 px-6 text-center text-xl font-bold ${borderColor}`}
            >
              {flipped ? current.back || "—" : current.front}
            </div>
            <p className="mt-2 text-center text-xs text-gray">
              {flipped ? "back" : "front"} · click to flip · drag to sort
            </p>
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
                {c.front}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Shuffle
