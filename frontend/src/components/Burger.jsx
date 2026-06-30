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
        <span className="block h-0.5 w-6 bg-cream" />
        <span className="block h-0.5 w-6 bg-cream" />
        <span className="block h-0.5 w-6 bg-cream" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <ul className="absolute left-0 top-full z-50 mt-3 w-40 overflow-hidden rounded-2xl bg-cream py-2 shadow-2xl">
            {["languages", "shuffle"].map((item) => (
              <li key={item}>
                <button
                  type="button"
                  className="w-full px-4 py-2 text-left text-ink hover:bg-rose"
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
