function LangCards() {
  const langs = ["Norwegian", "English", "German"]

  return (
    <section className="border-t border-black bg-white px-6 py-24 text-black">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3">
        {langs.map((lang) => (
          <button
            key={lang}
            type="button"
            className="border border-black px-6 py-16 text-2xl font-bold uppercase tracking-tight transition-colors hover:bg-black hover:text-white"
          >
            {lang}
          </button>
        ))}
      </div>
    </section>
  )
}

export default LangCards
