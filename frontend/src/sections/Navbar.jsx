import { useState } from "react"

import { NavLinkRight, NavLinkLeft } from "../components/Navlinks.jsx"

function Navbar() {

  return (
    <nav className="flex justify-between border-b-1 py-4 px-12">
      <NavLinkLeft />
      <div className="mx-auto w-30">
        <img src="" alt=""/>
        <h1>Logo</h1>
      </div>
      <NavLinkRight />
    </nav>
  )
}

export default Navbar
