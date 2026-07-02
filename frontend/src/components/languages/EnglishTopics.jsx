import { englishTopics } from "../../assets/english.js"
import { accents } from "../../assets/data.js"
import usePopup from "../../hooks/usePopup.js"
import Flag from "./Flag.jsx"
import GrammarPanel from "./GrammarPanel.jsx"

// Flags pinned to a right-side rail; clicking one fills the left with its
// grammar info. `selection.selected` holds the targeted topic index.
function EnglishTopics() {
  const selection = usePopup()
  const active = selection.isOpen ? englishTopics[selection.selected] : null

  return (
    <div className="flex min-h-[70vh] gap-10">
      <div className="flex-1">
        {active ? (
          <GrammarPanel topic={active} />
        ) : (
          <div className="flex h-full items-center justify-center text-gray">
            Pick a topic on the right →
          </div>
        )}
      </div>

      <ul className="flex w-2/5 flex-col items-end gap-2 border-r-2 border-borders pr-2">
        {englishTopics.map((t, i) => (
          <Flag
            key={t.title}
            index={i}
            topic={t}
            accent={accents[i % accents.length]}
            active={selection.selected === i}
            onSelect={() => selection.open(i)}
          />
        ))}
      </ul>
    </div>
  )
}

export default EnglishTopics
