import { useState } from "react"
import { Chevron, PlusIcon, XIcon } from "./Icons.jsx"

function LanguageFolder({ lang, selectedTopicId, onSelectTopic, onAddTopic, onDeleteLanguage, onDeleteTopic }) {
  const [open, setOpen] = useState(true)

  return (
    <li>
      <div className="group flex items-center hover:bg-third-background">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex flex-1 items-center gap-2 py-1.5 pl-2 pr-2 text-left text-sm"
        >
          <Chevron open={open} />
          {lang.name}
        </button>
        <button
          type="button"
          aria-label={`delete ${lang.name}`}
          onClick={() => onDeleteLanguage(lang.id)}
          className="px-2 text-gray opacity-0 hover:text-text group-hover:opacity-100"
        >
          <XIcon />
        </button>
      </div>

      {open && (
        <ul>
          {lang.topics.map((topic) => (
            <li key={topic.id}>
              <div
                className={`group flex items-center hover:bg-third-background ${
                  topic.id === selectedTopicId ? "bg-third-background" : ""
                }`}
              >
                <button
                  type="button"
                  onClick={() => onSelectTopic(topic.id)}
                  className={`flex-1 py-1.5 pl-9 pr-2 text-left text-sm ${
                    topic.id === selectedTopicId ? "font-semibold" : ""
                  }`}
                >
                  {topic.name}
                </button>
                <button
                  type="button"
                  aria-label={`delete ${topic.name}`}
                  onClick={() => onDeleteTopic(lang.id, topic.id)}
                  className="px-2 text-gray opacity-0 hover:text-text group-hover:opacity-100"
                >
                  <XIcon />
                </button>
              </div>
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

export default LanguageFolder
