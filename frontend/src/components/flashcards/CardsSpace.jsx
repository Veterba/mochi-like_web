import { useState } from "react"
import Shuffle from "./Shuffle.jsx"

function CardsSpace({ topic, onAddCard }) {
  const [shuffling, setShuffling] = useState(false)

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
          onClick={onAddCard}
          className="flex aspect-[3/4] items-center justify-center border-2 border-dashed border-borders text-xs text-gray hover:bg-text hover:text-background"
        >
          Add new card +
        </button>
        {topic.cards.map((card) => (
          <div
            key={card.id}
            className="flex aspect-[3/4] items-center justify-center border-2 border-borders text-xs text-gray"
          >
            {card.label}
          </div>
        ))}
      </div>

      {shuffling && (
        <Shuffle topicName={topic.name} cards={topic.cards} onClose={() => setShuffling(false)} />
      )}
    </main>
  )
}

export default CardsSpace
