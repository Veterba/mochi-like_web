import { languages, accents } from "../assets/data.js"

function LangCards() {
  return (
    <section className="flex gap-6 overflow-hidden border-t border-borders bg-background py-16">
      <div className="flex w-max animate-marquee">
        {[...languages, ...languages].map((name, i) => (
          <button
            key={i}
            type="button"
            className={`mr-6 shrink-0 border-2 ${accents[i % accents.length]} px-10 py-16 text-2xl font-bold uppercase tracking-tight transition-colors`}
          >
            {name}
          </button>
        ))}
      </div>
    </section>
  )
}

export default LangCards
