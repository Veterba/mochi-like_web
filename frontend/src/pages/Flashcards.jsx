import { useState } from "react"
import Navbar from "../sections/Navbar.jsx"
import Sidebar from "../components/flashcards/Sidebar.jsx"
import CardsSpace from "../components/flashcards/CardsSpace.jsx"

// Placeholder client-side model — swap for backend/db data + API calls later.
// Language folders start with no topics; topics are added by the user.
const seedLanguages = [
  { id: "en", name: "English", topics: [] },
  { id: "de", name: "German", topics: [] },
]
const sampleTrash = ["記憶", "Hund", "Apfel"]

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
  const [languages, setLanguages] = useState(seedLanguages)
  const [selectedTopicId, setSelectedTopicId] = useState(null)
  const [query, setQuery] = useState("")

  const visibleLanguages = filterLanguages(languages, query)
  const selectedTopic = languages.flatMap((l) => l.topics).find((t) => t.id === selectedTopicId)

  const addLanguage = () => {
    const name = window.prompt("New language folder name")?.trim()
    if (!name) return
    setLanguages((prev) => [...prev, { id: crypto.randomUUID(), name, topics: [] }])
  }

  const addTopic = (langId) => {
    const name = window.prompt("New topic-folder name")?.trim()
    if (!name) return
    setLanguages((prev) =>
      prev.map((l) =>
        l.id === langId
          ? { ...l, topics: [...l.topics, { id: crypto.randomUUID(), name, cards: [] }] }
          : l,
      ),
    )
  }

  const addCard = () => {
    setLanguages((prev) =>
      prev.map((l) => ({
        ...l,
        topics: l.topics.map((t) =>
          t.id === selectedTopicId
            ? { ...t, cards: [...t.cards, { id: crypto.randomUUID(), label: `Card ${t.cards.length + 1}` }] }
            : t,
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
          username="Guest"
          query={query}
          onQueryChange={setQuery}
          languages={visibleLanguages}
          selectedTopicId={selectedTopicId}
          onSelectTopic={setSelectedTopicId}
          onAddLanguage={addLanguage}
          onAddTopic={addTopic}
          onDeleteLanguage={deleteLanguage}
          onDeleteTopic={deleteTopic}
          trashCount={sampleTrash.length}
        />
        <CardsSpace topic={selectedTopic} onAddCard={addCard} />
      </div>
    </div>
  )
}

export default Flashcards
