import Navbar from '../sections/Navbar.jsx'
import Sidebar from '../components/flashcards/Sidebar.jsx'
import CardsSpace from '../components/flashcards/CardsSpace.jsx'
import NamePrompt from '../components/flashcards/NamePrompt.jsx'
import useProfile from '../hooks/useProfile.js'
import useDecks from '../hooks/useDecks.js'

function Flashcards() {
  const { nickname, avatar } = useProfile()
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
      <div className="flex">
        <Sidebar
          username={nickname}
          avatar={avatar}
          query={query}
          onQueryChange={setQuery}
          languages={visibleLanguages}
          selectedTopicId={selectedTopicId}
          onSelectTopic={setSelectedTopicId}
          onAddLanguage={() => setNaming({ kind: 'language' })}
          onAddTopic={(langId) => setNaming({ kind: 'topic', langId })}
          onDeleteLanguage={deleteLanguage}
          onDeleteTopic={deleteTopic}
          trashCount={trash.length}
        />
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
