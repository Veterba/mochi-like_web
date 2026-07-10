import { useState } from 'react'
import Navbar from '../sections/Navbar.jsx'
import Sidebar from '../components/flashcards/Sidebar.jsx'
import CardsSpace from '../components/flashcards/CardsSpace.jsx'
import NamePrompt from '../components/flashcards/NamePrompt.jsx'
import useProfile from '../hooks/useProfile.js'
import useDecks from '../hooks/useDecks.js'

function Flashcards() {
  const { nickname, avatar } = useProfile()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const {
    visibleLanguages,
    query,
    setQuery,
    selectedTopicId,
    setSelectedTopicId,
    selectedTopic,
    naming,
    setNaming,
    submitName,
    addCard,
    deleteCard,
    deleteLanguage,
    deleteTopic,
    trash,
  } = useDecks()

  return (
    <div>
      <Navbar sticky />

      {/* mobile folders toggle — hidden on md+ */}
      <div className="flex items-center gap-3 border-b border-borders px-4 py-2 md:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="border border-borders px-3 py-1 text-xs uppercase tracking-widest hover:bg-text hover:text-background"
        >
          ☰ Folders
        </button>
      </div>

      <div className="flex">
        {/* mobile backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* sidebar — drawer on mobile, static on desktop */}
        <div
          className={`fixed inset-y-0 left-0 z-40 transition-transform duration-200 md:static md:z-auto md:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <Sidebar
            username={nickname}
            avatar={avatar}
            query={query}
            onQueryChange={setQuery}
            languages={visibleLanguages}
            selectedTopicId={selectedTopicId}
            onSelectTopic={(id) => { setSelectedTopicId(id); setSidebarOpen(false) }}
            onAddLanguage={() => setNaming({ kind: 'language' })}
            onAddTopic={(langId) => setNaming({ kind: 'topic', langId })}
            onDeleteLanguage={deleteLanguage}
            onDeleteTopic={deleteTopic}
            trashCount={trash.length}
          />
        </div>

        <CardsSpace topic={selectedTopic} onAddCard={addCard} onDeleteCard={deleteCard} />
      </div>

      {naming && (
        <NamePrompt
          title={naming.kind === 'language' ? 'New language folder name' : 'New topic-folder name'}
          onSubmit={submitName}
          onClose={() => setNaming(null)}
        />
      )}
    </div>
  )
}

export default Flashcards
