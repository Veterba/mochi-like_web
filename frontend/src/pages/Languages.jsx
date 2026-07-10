import Navbar from "../sections/Navbar.jsx"
import { languages, accents } from "../assets/data.js"
import { guides } from "../assets/guides/index.js"
import LangCard from "../components/languages/LangCard.jsx"
import LangPopup from "../components/languages/LangPopup.jsx"
import useLearning from "../hooks/useLearning.js"
import usePopup from "../hooks/usePopup.js"

function Languages() {
  const { statuses, setStatus, remove } = useLearning()
  const popup = usePopup()

  return (
    <div>
      <Navbar sticky />
      <section className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
        <h1 className="mb-2 text-4xl font-black uppercase tracking-tight">Languages</h1>
        <p className="mb-8 text-sm uppercase tracking-widest text-gray">
          English, Norwegian, German and Spanish currently available
        </p>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
          {languages.map((name, i) => (
            <LangCard
              key={name}
              name={name}
              accent={accents[i % accents.length]}
              status={statuses[name]}
              onMark={() => popup.open(name)}
              available={Boolean(guides[name.toLowerCase()])}
            />
          ))}
        </div>
      </section>

      {popup.isOpen && (
        <LangPopup
          name={popup.selected}
          accent={accents[languages.indexOf(popup.selected) % accents.length]}
          status={statuses[popup.selected]}
          onSetStatus={(s) => {
            setStatus(popup.selected, s)
            popup.close()
          }}
          onRemove={() => {
            remove(popup.selected)
            popup.close()
          }}
          onClose={popup.close}
        />
      )}
    </div>
  )
}

export default Languages
