import { useState, useEffect } from 'react'
import Navbar from '../sections/Navbar.jsx'
import Shuffle from '../components/flashcards/Shuffle.jsx'
import CardEditor from '../components/flashcards/CardEditor.jsx'
import NamePrompt from '../components/flashcards/NamePrompt.jsx'
import { XIcon } from '../components/flashcards/Icons.jsx'
import useDecks from '../hooks/useDecks.js'

const totalCards = (folder) => folder.topics.reduce((sum, t) => sum + (t.cards?.length ?? 0), 0)

// A folder/topic list row: click to drill in, X to delete.
function Row({ label, count, onOpen, onDelete }) {
  return (
    <div className="group flex items-center justify-between border-2 border-borders px-4 py-4">
      <button
        type="button"
        onClick={onOpen}
        className="min-w-0 flex-1 truncate text-left text-sm font-bold uppercase tracking-widest"
      >
        {label}
      </button>
      <div className="flex items-center gap-3 pl-3">
        <span className="whitespace-nowrap text-xs text-gray">{count} cards</span>
        <button
          type="button"
          aria-label="delete"
          onClick={onDelete}
          className="text-gray opacity-0 hover:text-accent-2 group-hover:opacity-100"
        >
          <XIcon />
        </button>
        <button type="button" onClick={onOpen} aria-label="open" className="text-gray">
          ›
        </button>
      </div>
    </div>
  )
}

function AddRow({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border-2 border-dashed border-borders px-4 py-4 text-center text-xs font-bold uppercase tracking-widest text-gray hover:bg-text hover:text-background"
    >
      {label}
    </button>
  )
}

function Crumb({ label, onClick, current }) {
  if (current) {
    return <span className="truncate text-xs font-bold uppercase tracking-widest">{label}</span>
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className="whitespace-nowrap text-xs font-bold uppercase tracking-widest text-accent-3 hover:underline"
    >
      {label}
    </button>
  )
}

function Flashcards() {
  const {
    languages,
    setSelectedTopicId,
    selectedTopic,
    naming,
    setNaming,
    submitName,
    addCard,
    deleteCard,
    deleteLanguage,
    deleteTopic,
  } = useDecks()

  const [view, setView] = useState('home') // home | folder | topic
  const [folderId, setFolderId] = useState(null)
  const [flipped, setFlipped] = useState({})
  const [editing, setEditing] = useState(false)
  const [shuffling, setShuffling] = useState(false)

  const folder = languages.find((l) => l.id === folderId)
  const topic = selectedTopic

  // Fall back up the stack if the current folder/topic disappears (deleted).
  useEffect(() => {
    if (view === 'folder' && !folder) setView('home')
    if (view === 'topic' && !topic) setView(folder ? 'folder' : 'home')
  }, [view, folder, topic])

  const openFolder = (id) => { setFolderId(id); setView('folder') }
  const openTopic = (id) => { setSelectedTopicId(id); setFlipped({}); setView('topic') }
  const toggleFlip = (id) => setFlipped((p) => ({ ...p, [id]: !p[id] }))

  return (
    <div className="min-h-screen bg-background">
      <Navbar sticky />

      <section className="mx-auto max-w-3xl px-4 py-6">
        {/* HOME — folders */}
        {view === 'home' && (
          <div className="flex flex-col gap-2">
            {languages.length === 0 && (
              <p className="mt-8 text-center text-xs uppercase tracking-widest text-gray">
                No folders yet. Add one below.
              </p>
            )}
            {languages.map((f) => (
              <Row
                key={f.id}
                label={f.name}
                count={totalCards(f)}
                onOpen={() => openFolder(f.id)}
                onDelete={() => deleteLanguage(f.id)}
              />
            ))}
            <AddRow label="+ New Folder" onClick={() => setNaming({ kind: 'language' })} />
          </div>
        )}

        {/* FOLDER — topics */}
        {view === 'folder' && folder && (
          <div className="flex flex-col gap-2">
            <div className="mb-2 flex items-center gap-1.5 border-b-2 border-borders pb-3">
              <Crumb label="‹ Flashcards" onClick={() => setView('home')} />
              <span className="text-xs text-gray">›</span>
              <Crumb label={folder.name} current />
            </div>
            {folder.topics.length === 0 && (
              <p className="mt-8 text-center text-xs uppercase tracking-widest text-gray">
                No topics yet. Add one below.
              </p>
            )}
            {folder.topics.map((t) => (
              <Row
                key={t.id}
                label={t.name}
                count={t.cards?.length ?? 0}
                onOpen={() => openTopic(t.id)}
                onDelete={() => deleteTopic(folder.id, t.id)}
              />
            ))}
            <AddRow label="+ New Topic" onClick={() => setNaming({ kind: 'topic', langId: folder.id })} />
          </div>
        )}

        {/* TOPIC — cards */}
        {view === 'topic' && topic && (
          <div>
            <div className="mb-2 flex items-center gap-1.5 border-b-2 border-borders pb-3">
              <Crumb label="Flashcards" onClick={() => setView('home')} />
              <span className="text-xs text-gray">›</span>
              {folder && (
                <>
                  <Crumb label={folder.name} onClick={() => setView('folder')} />
                  <span className="text-xs text-gray">›</span>
                </>
              )}
              <Crumb label={topic.name} current />
            </div>

            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-gray">{topic.cards.length} cards</span>
              <button
                type="button"
                onClick={() => setShuffling(true)}
                disabled={topic.cards.length === 0}
                className="border-2 border-borders px-3 py-1.5 text-xs font-bold uppercase tracking-widest hover:bg-text hover:text-background disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-text"
              >
                Review ›
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="flex aspect-[4/3] items-center justify-center border-2 border-dashed border-borders text-xs font-bold uppercase tracking-widest text-gray hover:bg-text hover:text-background"
              >
                + New Card
              </button>
              {topic.cards.map((card) => (
                <div
                  key={card.id}
                  className="group relative flex aspect-[4/3] cursor-pointer flex-col items-center justify-center border-2 border-borders px-2 text-center"
                  onClick={() => toggleFlip(card.id)}
                >
                  {flipped[card.id] ? (
                    <>
                      <span className="mb-1 text-[9px] uppercase tracking-widest text-gray">back</span>
                      <span className="text-xs">{card.back || '—'}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-sm font-bold">{card.front}</span>
                      <span className="mt-1 text-[9px] uppercase tracking-widest text-gray">tap to flip</span>
                    </>
                  )}
                  <button
                    type="button"
                    aria-label="delete card"
                    onClick={(e) => { e.stopPropagation(); deleteCard(card.id) }}
                    className="absolute right-1 top-1 text-gray opacity-0 hover:text-accent-2 group-hover:opacity-100"
                  >
                    <XIcon />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {naming && (
        <NamePrompt
          title={naming.kind === 'language' ? 'New Folder' : 'New Topic'}
          onSubmit={submitName}
          onClose={() => setNaming(null)}
        />
      )}
      {editing && topic && (
        <CardEditor
          onSave={(front, back) => { addCard(front, back); setEditing(false) }}
          onClose={() => setEditing(false)}
        />
      )}
      {shuffling && topic && (
        <Shuffle topicName={topic.name} cards={topic.cards} onClose={() => setShuffling(false)} />
      )}
    </div>
  )
}

export default Flashcards
