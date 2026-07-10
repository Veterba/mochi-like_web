import { useParams, Link } from "react-router-dom"
import Navbar from "../sections/Navbar.jsx"
import { languages } from "../assets/data.js"
import { guides } from "../assets/guides/index.js"
import useLearning from "../hooks/useLearning.js"
import { useMarkActiveToday } from "../hooks/useActivity.js"
import LanguageTopics from "../components/languages/LanguageTopics.jsx"

function LanguagePage() {
  const { slug } = useParams()
  const name = languages.find((l) => l.toLowerCase() === slug)
  const topics = guides[slug]
  const { statuses } = useLearning()
  useMarkActiveToday() // visiting a language page counts as an active day

  if (!name) {
    return (
      <div>
        <Navbar sticky />
        <div className="p-12 text-gray">
          Unknown language.{" "}
          <Link to="/languages" className="underline">
            Back to languages
          </Link>
        </div>
      </div>
    )
  }

  const status = statuses[name]

  return (
    <div>
      <Navbar sticky />
      <section className="px-4 py-8 md:px-8 md:py-12">
        <Link
          to="/languages"
          className="text-xs uppercase tracking-widest text-gray hover:underline"
        >
          ← Languages
        </Link>
        <h1 className="mt-4 text-4xl font-black uppercase tracking-tight md:text-5xl">{name}</h1>
        {status && (
          <p className="mt-2 text-sm uppercase tracking-widest text-gray">currently · {status}</p>
        )}
        <div className="mt-10">
          {topics ? (
            <LanguageTopics language={name} topics={topics} />
          ) : (
            <div className="flex min-h-[40vh] items-center justify-center border-2 border-dashed border-borders text-gray">
              {name} learning content — coming soon
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default LanguagePage
