import Navbar from '../sections/Navbar.jsx'
import Hero from '../sections/Hero.jsx'
import LangCards from '../sections/LangCards.jsx'
import { sections } from '../assets/data.js'

function Homepage() {
  return (
    <div>
      <Navbar sticky />
      <Hero />
      <LangCards />

      {sections.map((s) => (
        <section key={s.id} className="border-t border-borders bg-background px-6 py-20 text-text">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-4xl font-black uppercase tracking-tight sm:text-5xl">
              {s.heading}
            </h2>
            <div className="mt-4 max-w-2xl space-y-3 text-gray">
              {s.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
              <a
                href={s.link.href}
                className="inline-block font-semibold text-text underline-offset-2 hover:underline"
              >
                {s.link.label} →
              </a>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex items-center justify-center border-2 border-borders bg-third-background text-sm uppercase tracking-widest text-gray">
                video
              </div>
              <div className="flex flex-col gap-6">
                {s.cards.map((c) => (
                  <div key={c.title} className="border border-borders p-6">
                    <h3 className="font-bold text-text">{c.title}</h3>
                    <p className="mt-1 text-sm text-gray">{c.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  )
}

export default Homepage
