import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useTranslation } from 'react-i18next'

// Brutalist markdown mapping: sharp borders, theme colors, no rounding.
const components = {
  h2: (props) => (
    <h3 className="mt-8 border-b-2 border-borders pb-1 text-xl font-black uppercase tracking-tight" {...props} />
  ),
  h3: (props) => <h4 className="mt-6 text-base font-bold uppercase" {...props} />,
  p: (props) => <p className="mt-3 leading-relaxed" {...props} />,
  ul: (props) => <ul className="mt-3 list-none space-y-2 border-l-2 border-borders pl-4" {...props} />,
  ol: (props) => <ol className="mt-3 list-decimal space-y-2 pl-6" {...props} />,
  li: (props) => <li className="leading-relaxed" {...props} />,
  strong: (props) => <strong className="font-bold" {...props} />,
  del: (props) => <del className="text-accent-2" {...props} />,
  table: (props) => (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full border-2 border-borders text-left text-sm" {...props} />
    </div>
  ),
  thead: (props) => <thead className="bg-accent-background uppercase" {...props} />,
  th: (props) => <th className="border border-borders px-3 py-2 font-bold" {...props} />,
  td: (props) => <td className="border border-borders px-3 py-2" {...props} />,
  code: (props) => <code className="bg-third-background px-1" {...props} />,
  hr: () => <hr className="mt-6 border-borders" />,
}

// Left-side detail for whichever flag is targeted: the full lesson,
// rendered from the language guide's markdown.
function GrammarPanel({ language, topic }) {
  const { t } = useTranslation()
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-gray">{t('languagePage.grammarLabel')} · {language}</p>
      <h2 className="mt-2 text-3xl font-black uppercase tracking-tight">{topic.title}</h2>
      <div className="mt-4 max-w-2xl text-text">
        <Markdown remarkPlugins={[remarkGfm]} components={components}>
          {topic.body}
        </Markdown>
      </div>
    </div>
  )
}

export default GrammarPanel
