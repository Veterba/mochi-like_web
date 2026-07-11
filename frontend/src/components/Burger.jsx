import { useState } from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"

const navItems = [
  { key: "languages", to: "/languages" },
  { key: "flashcards", to: "/flashcards" },
]

function Burger() {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useTranslation()

  const close = () => setIsOpen(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-label="menu"
        className="flex h-8 w-8 flex-col items-center justify-center gap-1.5"
      >
        <span className="block h-0.5 w-6 bg-text" />
        <span className="block h-0.5 w-6 bg-text" />
        <span className="block h-0.5 w-6 bg-text" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={close} />
          <ul className="absolute left-0 top-full z-50 mt-4 border border-borders bg-background">
            {navItems.map((item) => (
              <li key={item.key}>
                <Link
                  to={item.to}
                  onClick={close}
                  className="block w-full px-4 py-4 text-left text-text hover:bg-text hover:text-background"
                >
                  {t(`nav.${item.key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

export default Burger
