import { useTranslation } from "react-i18next"
import { accents } from "../../assets/data.js"
import usePopup from "../../hooks/usePopup.js"
import Flag from "./Flag.jsx"
import GrammarPanel from "./GrammarPanel.jsx"

// Flags pinned to a right-side rail; clicking one fills the left with that
// topic's lesson. Works for any language with a parsed guide (see
// assets/guides/index.js). `selection.selected` holds the topic index.
function LanguageTopics({ language, topics }) {
  const { t } = useTranslation()
  const selection = usePopup()
  const active = selection.isOpen ? topics[selection.selected] : null

  return (
    <div className="flex min-h-[70vh] flex-col gap-6 md:flex-row md:gap-10">
      {/* topic list — full width on mobile, right rail on desktop */}
      <ul className="flex flex-col items-end gap-2 self-start border-r-2 border-borders pr-2 md:order-last md:w-2/5">
        {topics.map((t, i) => (
          <Flag
            key={t.slug || t.title}
            index={i}
            topic={t}
            accent={accents[i % accents.length]}
            active={selection.selected === i}
            onSelect={() => selection.open(i)}
          />
        ))}
      </ul>

      <div className="flex-1 overflow-y-auto">
        {active ? (
          <GrammarPanel language={language} topic={active} />
        ) : (
          <div className="hidden items-center justify-center text-gray md:flex md:h-full">
            {t("languagePage.pickTopic")}
          </div>
        )}
      </div>
    </div>
  )
}

export default LanguageTopics
