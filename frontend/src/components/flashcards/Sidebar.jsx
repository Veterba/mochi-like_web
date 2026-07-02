import { ProfileIcon, SearchIcon, PlusIcon, TrashIcon } from "./Icons.jsx"
import LanguageFolder from "./LanguageFolder.jsx"

function Sidebar({
  username,
  avatar,
  query,
  onQueryChange,
  languages,
  selectedTopicId,
  onSelectTopic,
  onAddLanguage,
  onAddTopic,
  onDeleteLanguage,
  onDeleteTopic,
  trashCount,
}) {
  return (
    <aside className="flex min-h-[calc(100vh-4rem)] w-72 flex-col border-r border-borders bg-background">
      {/* Profile — icon + username */}
      <div className="flex items-center gap-2 border-b border-borders p-3">
        {avatar ? (
          <img src={avatar} alt="" className="h-9 w-9 border border-borders object-cover" />
        ) : (
          <span className="flex h-9 w-9 items-center justify-center border border-borders">
            <ProfileIcon />
          </span>
        )}
        <span className="text-sm">{username}</span>
      </div>

      {/* Search */}
      <div className="p-3">
        <div className="flex items-center gap-2 border border-borders px-3 py-2 text-gray">
          <SearchIcon />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search cards & folders"
            className="w-full bg-transparent text-sm text-text outline-none placeholder:text-gray"
          />
        </div>
      </div>

      {/* Folders */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest text-gray">Folders</span>
          <button type="button" aria-label="new language folder" onClick={onAddLanguage} className="hover:text-gray">
            <PlusIcon />
          </button>
        </div>
        <ul className="mt-2">
          {languages.map((lang) => (
            <LanguageFolder
              key={lang.id}
              lang={lang}
              selectedTopicId={selectedTopicId}
              onSelectTopic={onSelectTopic}
              onAddTopic={onAddTopic}
              onDeleteLanguage={onDeleteLanguage}
              onDeleteTopic={onDeleteTopic}
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
        <span className="border border-borders px-2 text-xs text-gray">{trashCount}</span>
      </button>
    </aside>
  )
}

export default Sidebar
