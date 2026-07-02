import { XIcon } from "./Icons.jsx"
import useSwipeDeck from "../../hooks/useSwipeDeck.js"
import { useMarkActiveToday } from "../../hooks/useActivity.js"

function Shuffle({ topicName, cards, onClose }) {
  useMarkActiveToday() // using shuffle counts as an active day
  const {
    current,
    buffer,
    learned,
    flipped,
    dx,
    isDragging,
    intent,
    onPointerDown,
    onPointerMove,
    onPointerUp,
  } = useSwipeDeck(cards)

  const borderColor =
    intent === "know" ? "border-4 border-accent-3" : intent === "dont" ? "border-4 border-accent-2" : "border-borders"

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
                backgroundColor: "#F9F7F5",
                color: "#1B1717",
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

        {/* Rest (buffer, still to learn) · Learned (swiped green) */}
        <div className="mt-8 grid grid-cols-2 gap-6 border-t border-borders pt-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-gray">Rest · {buffer.length}</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {buffer.map((c) => (
                <span key={c.id} className="border border-accent-2 px-2 py-1 text-xs text-accent-2">
                  {c.front}
                </span>
              ))}
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs uppercase tracking-widest text-gray">Learned · {learned.length}</span>
            <div className="mt-2 flex flex-wrap justify-end gap-2">
              {learned.map((c) => (
                <span key={c.id} className="border border-accent-3 px-2 py-1 text-xs text-accent-3">
                  {c.front}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Shuffle
