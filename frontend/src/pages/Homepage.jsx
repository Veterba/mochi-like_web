import { useTranslation } from 'react-i18next'
import Navbar from '../sections/Navbar.jsx'
import Hero from '../sections/Hero.jsx'
import LangCards from '../sections/LangCards.jsx'

function Homepage() {
  const { t } = useTranslation()
  const sections = t('home.sections', { returnObjects: true })

  return (
    <div>
      <Navbar sticky />
      <Hero />
      <LangCards />

      {sections.map((s) => (
        <section key={s.heading} className="border-t border-borders bg-background px-4 py-12 md:px-6 md:py-20 text-text">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-4xl font-black uppercase tracking-tight sm:text-5xl">
              {s.heading}
            </h2>
            <div className="mt-4 max-w-2xl space-y-3 text-gray">
              {s.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
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
