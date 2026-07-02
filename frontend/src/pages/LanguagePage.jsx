import { useParams, Link } from "react-router-dom"
import Navbar from "../sections/Navbar.jsx"
import { languages } from "../assets/data.js"
import useLearning from "../hooks/useLearning.js"
import { useMarkActiveToday } from "../hooks/useActivity.js"
import EnglishTopics from "../components/languages/EnglishTopics.jsx"

function LanguagePage() {
  const { slug } = useParams()
  const name = languages.find((l) => l.toLowerCase() === slug)
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
      <section className="px-8 py-12">
        <Link
          to="/languages"
          className="text-xs uppercase tracking-widest text-gray hover:underline"
        >
          ← Languages
        </Link>
        <h1 className="mt-4 text-5xl font-black uppercase tracking-tight">{name}</h1>
        {status && (
          <p className="mt-2 text-sm uppercase tracking-widest text-gray">currently · {status}</p>
        )}
        <div className="mt-10">
          {slug === "english" ? (
            <EnglishTopics />
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
