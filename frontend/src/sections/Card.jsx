import { useState } from "react"
import PopUp from "../components/PopUp.jsx"

function randomPad() {
  return Math.floor(Math.random() * (500)) + 500
}

function Card() {
  const [cards, setCards] = useState([])
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  // random padding for the "+" card, generated once on mount
  const [addPad] = useState(randomPad)

  function addCard() {
    if (!name.trim()) return
    setCards([...cards, { id: Date.now(), name: name.trim(), pad: randomPad() }])
    setName("")
    setOpen(false)
  }

  return (
    <div className="flex flex-col items-end">
      {cards.map((card) => (
        <div
          key={card.id}
          style={{ paddingRight: card.pad }}
          className="bg-white text-black p-2"
        >
          {card.name}
        </div>
      ))}

      {/* "+" add-card — always rendered last, with its own random padding */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{ paddingRight: addPad }}
        className="p-2 text-white border border-white"
      >
        +
      </button>

      <PopUp isOpen={open} onClose={() => setOpen(false)}>
        <h2 className="mb-4 text-lg font-semibold">Name your card</h2>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addCard()}
          placeholder="Card name"
          className="w-full px-3 py-2"
        />
        <button
          type="button"
          onClick={addCard}
          className="mt-4 bg-blue-600 px-4 py-2 text-white"
        >
          Add
        </button>
      </PopUp>
    </div>
  )
}

export default Card
