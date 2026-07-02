import { useRef, useState } from "react"

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

// Swipe-to-sort deck state machine. Returns the current card, the two
// piles, and pointer handlers — the JSX just renders what it gets.
export default function useSwipeDeck(cards) {
  const [queue, setQueue] = useState(() => shuffleArray(cards))
  const [buffer, setBuffer] = useState([])
  const [learned, setLearned] = useState([])
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
      if (!toBuffer) setLearned((l) => [...l, current])
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

  return {
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
  }
}
