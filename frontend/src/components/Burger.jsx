import { useState } from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useAuth } from "../hooks/useAuth.jsx"

const navItems = [
  { key: "flashcards", to: "/flashcards" },
  { key: "languages", to: "/languages" },
]

const itemClass =
  "block w-full px-4 py-4 text-left text-text hover:bg-text hover:text-background"

function Burger({ onAuthClick }) {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuth()
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
                <Link to={item.to} onClick={close} className={itemClass}>
                  {t(`nav.${item.key}`)}
                </Link>
              </li>
            ))}

            {/* On mobile the right-side nav is hidden, so mirror it here. */}
            {user ? (
              <li className="md:hidden">
                <button
                  type="button"
                  onClick={() => { logout(); close() }}
                  className={itemClass}
                >
                  {t("nav.logout")}
                </button>
              </li>
            ) : (
              <li className="md:hidden">
                <button
                  type="button"
                  onClick={() => { onAuthClick?.(); close() }}
                  className={itemClass}
                >
                  {t("nav.auth")}
                </button>
              </li>
            )}
            <li className="md:hidden">
              <Link to="/tutor" onClick={close} className={itemClass}>
                {t("nav.tutor")}
              </Link>
            </li>
            <li className="md:hidden">
              <a href="#blog" onClick={close} className={itemClass}>
                {t("nav.blog")}
              </a>
            </li>
          </ul>
        </>
      )}
    </div>
  )
}

export default Burger
