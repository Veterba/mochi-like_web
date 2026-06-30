import { useState } from "react"

import { NavLinkRight } from "../components/Navlinks.jsx"
import Burger from "../components/Burger.jsx"
import Auth from "../components/Auth.jsx"

function Navbar() {
  const [isAuthOpen, setIsAuthOpen] = useState(false)

  return (
    <nav className="flex justify-between border-b-1 py-4 px-12">
      <Burger />
      <div className="mx-auto w-30">
        <a href="" className="text-center">
          <h1>logo</h1>
        </a>
      </div>
      <NavLinkRight onAuthClick={() => setIsAuthOpen(true)} />
      <Auth isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />    
    </nav>
  )
}

export default Navbar
