import { useState } from "react"
import Shuffle from "./Shuffle.jsx"
import CardEditor from "./CardEditor.jsx"
import { XIcon } from "./Icons.jsx"

function CardsSpace({ topic, onAddCard, onDeleteCard }) {
  const [shuffling, setShuffling] = useState(false)
  const [editing, setEditing] = useState(false)

  if (!topic) {
    return (
      <main className="flex-1 p-8">
        <div className="flex min-h-[50vh] items-center justify-center text-gray">
          Select a topic-folder to see its cards
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 p-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold uppercase tracking-tight">{topic.name}</h2>
        <button
          type="button"
          onClick={() => setShuffling(true)}
          disabled={topic.cards.length === 0}
          className="border border-borders px-4 py-2 text-sm uppercase hover:bg-text hover:text-background disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-text"
        >
          Shuffle
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="flex aspect-[4/3] items-center justify-center border-2 border-dashed border-borders text-xs text-gray hover:bg-text hover:text-background"
        >
          Add new card +
        </button>
        {topic.cards.map((card) => (
          <div
            key={card.id}
            className="group relative flex aspect-[4/3] items-center justify-center overflow-hidden border-2 border-borders px-2 text-center text-xs"
          >
            {card.front}
            <button
              type="button"
              aria-label="delete card"
              onClick={() => onDeleteCard(card.id)}
              className="absolute right-1 top-1 text-gray opacity-0 hover:text-text group-hover:opacity-100"
            >
              <XIcon />
            </button>
          </div>
        ))}
      </div>

      {shuffling && (
        <Shuffle topicName={topic.name} cards={topic.cards} onClose={() => setShuffling(false)} />
      )}
      {editing && (
        <CardEditor
          onSave={(front, back) => {
            onAddCard(front, back)
            setEditing(false)
          }}
          onClose={() => setEditing(false)}
        />
      )}
    </main>
  )
}

export default CardsSpace
