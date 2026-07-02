import { useState } from "react"
import Navbar from "../sections/Navbar.jsx"
import Sidebar from "../components/flashcards/Sidebar.jsx"
import CardsSpace from "../components/flashcards/CardsSpace.jsx"
import NamePrompt from "../components/flashcards/NamePrompt.jsx"
import useProfile from "../hooks/useProfile.js"

// Placeholder client-side model — swap for backend/db data + API calls later.
// Language folders start with no topics; topics are added by the user.
const seedLanguages = [
  { id: "en", name: "English", topics: [] },
  { id: "de", name: "German", topics: [] },
]

function filterLanguages(langs, query) {
  if (!query) return langs
  const q = query.toLowerCase()
  return langs.reduce((acc, lang) => {
    if (lang.name.toLowerCase().includes(q)) {
      acc.push(lang)
      return acc
    }
    const topics = lang.topics.filter((t) => t.name.toLowerCase().includes(q))
    if (topics.length) acc.push({ ...lang, topics })
    return acc
  }, [])
}

function Flashcards() {
  const { nickname, avatar } = useProfile()
  const [languages, setLanguages] = useState(seedLanguages)
  const [selectedTopicId, setSelectedTopicId] = useState(null)
  const [query, setQuery] = useState("")
  const [trash, setTrash] = useState([]) // deleted cards
  const [naming, setNaming] = useState(null) // { kind: 'language' } | { kind: 'topic', langId }

  const visibleLanguages = filterLanguages(languages, query)
  const selectedTopic = languages.flatMap((l) => l.topics).find((t) => t.id === selectedTopicId)

  const submitName = (name) => {
    if (!naming) return
    if (naming.kind === "language") {
      setLanguages((prev) => [...prev, { id: crypto.randomUUID(), name, topics: [] }])
    } else {
      setLanguages((prev) =>
        prev.map((l) =>
          l.id === naming.langId
            ? { ...l, topics: [...l.topics, { id: crypto.randomUUID(), name, cards: [] }] }
            : l,
        ),
      )
    }
    setNaming(null)
  }

  const addCard = (front, back) => {
    setLanguages((prev) =>
      prev.map((l) => ({
        ...l,
        topics: l.topics.map((t) =>
          t.id === selectedTopicId
            ? { ...t, cards: [...t.cards, { id: crypto.randomUUID(), front, back }] }
            : t,
        ),
      })),
    )
  }

  const deleteCard = (cardId) => {
    const card = selectedTopic?.cards.find((c) => c.id === cardId)
    if (card) setTrash((t) => [...t, card])
    setLanguages((prev) =>
      prev.map((l) => ({
        ...l,
        topics: l.topics.map((t) =>
          t.id === selectedTopicId ? { ...t, cards: t.cards.filter((c) => c.id !== cardId) } : t,
        ),
      })),
    )
  }

  const deleteLanguage = (langId) => {
    const lang = languages.find((l) => l.id === langId)
    if (lang?.topics.some((t) => t.id === selectedTopicId)) setSelectedTopicId(null)
    setLanguages((prev) => prev.filter((l) => l.id !== langId))
  }

  const deleteTopic = (langId, topicId) => {
    if (topicId === selectedTopicId) setSelectedTopicId(null)
    setLanguages((prev) =>
      prev.map((l) =>
        l.id === langId ? { ...l, topics: l.topics.filter((t) => t.id !== topicId) } : l,
      ),
    )
  }

  return (
    <div>
      <Navbar sticky />
      <div className="flex">
        <Sidebar
          username={nickname}
          avatar={avatar}
          query={query}
          onQueryChange={setQuery}
          languages={visibleLanguages}
          selectedTopicId={selectedTopicId}
          onSelectTopic={setSelectedTopicId}
          onAddLanguage={() => setNaming({ kind: "language" })}
          onAddTopic={(langId) => setNaming({ kind: "topic", langId })}
          onDeleteLanguage={deleteLanguage}
          onDeleteTopic={deleteTopic}
          trashCount={trash.length}
        />
        <CardsSpace topic={selectedTopic} onAddCard={addCard} onDeleteCard={deleteCard} />
      </div>

      {naming && (
        <NamePrompt
          title={naming.kind === "language" ? "New language folder name" : "New topic-folder name"}
          onSubmit={submitName}
          onClose={() => setNaming(null)}
        />
      )}
    </div>
  )
}

export default Flashcards
