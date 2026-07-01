import { useState } from "react"

function Burger() {
  const [isOpen, setIsOpen] = useState(false)

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
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <ul className="absolute left-0 top-full z-50 mt-4 border border-borders bg-background">
            {["languages", "shuffle", "profile"].map((item) => (
              <li key={item}>
                <button
                  type="button"
                  className="w-full px-2 py-2 text-left text-text hover:bg-text hover:text-background"
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

export default Burger
