import { useState } from "react"
import { useTranslation } from "react-i18next"
import { LANGUAGES } from "../i18n/index.js"

function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const close = () => setIsOpen(false)
  const current = LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0]

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-label="language"
        className="flex h-8 items-center border border-borders px-3 text-sm uppercase text-text hover:bg-text hover:text-background"
      >
        {current.code}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={close} />
          <ul className="absolute left-0 top-full z-50 mt-4 border border-borders bg-background">
            {LANGUAGES.map((lang) => (
              <li key={lang.code}>
                <button
                  type="button"
                  onClick={() => {
                    i18n.changeLanguage(lang.code)
                    close()
                  }}
                  className={`block w-full whitespace-nowrap px-4 py-4 text-left hover:bg-text hover:text-background ${
                    lang.code === current.code ? "bg-text text-background" : "text-text"
                  }`}
                >
                  {lang.label}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

export default LanguageSwitcher
