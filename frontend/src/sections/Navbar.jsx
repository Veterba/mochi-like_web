import { useState } from "react"

import { NavLinkRight, NavLinkLeft } from "../components/Navlinks.jsx"

function Navbar() {

  return (
    <nav className="flex justify-between border-b-1 py-4 px-12">
      <NavLinkLeft />
      <div className="mx-auto w-30">
        <a href="" className="text-center">
          <h1>POP</h1>
          <h1>UP</h1>
        </a>
      </div>
      <NavLinkRight />
    </nav>
  )
}

export default Navbar
