import { useState } from "react"
import { Link } from "react-router-dom"

import NavLinkRight from "../components/Navlinks.jsx"
import Burger from "../components/Burger.jsx"
import Auth from "../components/Auth.jsx"
import LanguageSwitcher from "../components/LanguageSwitcher.jsx"

function Navbar({ sticky = false }) {
  const [isAuthOpen, setIsAuthOpen] = useState(false)

  return (
    <nav
      className={`grid grid-cols-3 items-center border-b border-borders bg-background py-4 px-4 md:px-12 text-text${
        sticky ? " sticky top-0 z-40" : ""
      }`}
    >
      <div className="flex items-center gap-3 justify-self-start">
        <Burger />
        <LanguageSwitcher />
      </div>
      <div className="justify-self-center">
        <Link to="/" className="text-center">
          <h1>pop up</h1>
        </Link>
      </div>
      <div className="hidden justify-self-end md:block">
        <NavLinkRight onAuthClick={() => setIsAuthOpen(true)} />
      </div>
      <Auth isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </nav>
  )
}

export default Navbar
