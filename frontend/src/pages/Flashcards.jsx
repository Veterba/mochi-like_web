import { useState } from "react"
import Navbar from "../sections/Navbar.jsx"

// Placeholder client-side model — swap for backend/db data + API calls later.
// Language folders start with no topics; topics are added by the user.
const seedLanguages = [
  { id: "en", name: "English", topics: [] },
  { id: "de", name: "German", topics: [] },
]
const sampleTrash = ["記憶", "Hund", "Apfel"]

const iconCls = "h-5 w-5 shrink-0"

function ProfileIcon() {
  return (
    <svg className={iconCls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg className={iconCls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4-4" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg className={iconCls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg className={iconCls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
    </svg>
  )
}

function Chevron({ open }) {
  return (
    <svg
      className={`h-3 w-3 shrink-0 transition-transform ${open ? "rotate-90" : ""}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  )
}

function LanguageFolder({ lang, selectedTopicId, onSelectTopic, onAddTopic }) {
  const [open, setOpen] = useState(true)

  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 py-1.5 pl-2 pr-2 text-left text-sm hover:bg-third-background"
      >
        <Chevron open={open} />
        {lang.name}
      </button>

      {open && (
        <ul>
          {lang.topics.map((topic) => (
            <li key={topic.id}>
              <button
                type="button"
                onClick={() => onSelectTopic(topic.id)}
                className={`flex w-full items-center py-1.5 pl-9 pr-2 text-left text-sm hover:bg-third-background ${
                  topic.id === selectedTopicId ? "bg-third-background font-semibold" : ""
                }`}
              >
                {topic.name}
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={() => onAddTopic(lang.id)}
              className="flex w-full items-center gap-1 py-1.5 pl-9 pr-2 text-left text-sm text-gray hover:text-text"
            >
              <PlusIcon />
              add new topic-folder
            </button>
          </li>
        </ul>
      )}
    </li>
  )
}

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
  const selectedTopic = languages
    .flatMap((l) => l.topics)
    .find((t) => t.id === selectedTopicId)

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
          t.id === selectedTopicId ? { ...t, cards: [...t.cards, { id: crypto.randomUUID() }] } : t,
        ),
      })),
    )
  }

  return (
    <div>
      <Navbar sticky />
      <div className="flex">
        <aside className="flex min-h-[calc(100vh-4rem)] w-72 flex-col border-r border-borders bg-background">
          {/* Profile — icon only */}
          <div className="border-b border-borders p-3">
            <button
              type="button"
              aria-label="profile"
              className="flex h-9 w-9 items-center justify-center border border-borders hover:bg-text hover:text-background"
            >
              <ProfileIcon />
            </button>
          </div>

          {/* Search */}
          <div className="p-3">
            <div className="flex items-center gap-2 border border-borders px-3 py-2 text-gray">
              <SearchIcon />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search cards & folders"
                className="w-full bg-transparent text-sm text-text outline-none placeholder:text-gray"
              />
            </div>
          </div>

          {/* Folders */}
          <div className="flex-1 overflow-y-auto p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-gray">Folders</span>
              <button type="button" aria-label="new language folder" onClick={addLanguage} className="hover:text-gray">
                <PlusIcon />
              </button>
            </div>
            <ul className="mt-2">
              {visibleLanguages.map((lang) => (
                <LanguageFolder
                  key={lang.id}
                  lang={lang}
                  selectedTopicId={selectedTopicId}
                  onSelectTopic={setSelectedTopicId}
                  onAddTopic={addTopic}
                />
              ))}
            </ul>
          </div>

          {/* Trash */}
          <button
            type="button"
            className="flex items-center justify-between border-t border-borders px-3 py-3 text-sm hover:bg-third-background"
          >
            <span className="flex items-center gap-2">
              <TrashIcon />
              Trash
            </span>
            <span className="border border-borders px-2 text-xs text-gray">{sampleTrash.length}</span>
          </button>
        </aside>

        {/* Cards space */}
        <main className="flex-1 p-8">
          {selectedTopic ? (
            <>
              <h2 className="mb-6 text-2xl font-bold uppercase tracking-tight">{selectedTopic.name}</h2>
              <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
                <button
                  type="button"
                  onClick={addCard}
                  className="flex aspect-[3/4] items-center justify-center border-2 border-dashed border-borders text-sm text-gray hover:bg-text hover:text-background"
                >
                  Add new card +
                </button>
                {selectedTopic.cards.map((card, i) => (
                  <div
                    key={card.id}
                    className="flex aspect-[3/4] items-center justify-center border-2 border-borders text-gray"
                  >
                    Card {i + 1}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex min-h-[50vh] items-center justify-center text-gray">
              Select a topic-folder to see its cards
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default Flashcards
