import { useState } from "react"

import Burger from "../components/Burger.jsx"

function Navbar() {

  const [openBurger, setBurgerOpen] = useState(false) 

  const toggleBruger = () => {
    setBurgerOpen(!openBurger)
  }


  return (
    <nav>
      <div>
        <ul>
          {['home', 'about'].map((item) => (
            <li className="app__flex p-text" key={`link-${item}`}>
              <div />
              <a href={`#${item}`}>{item}</a>
            </li>
          ))} 
        </ul>
      </div>

      <div>
        <img src="" alt=""/>
      </div>

      <div>
        <ul>
          {['auth', 'blog'].map((item) => (
            <li className="app__flex p-text" key={`link-${item}`}>
              <div />
              <a href={`#${item}`}>{item}</a>
            </li>
          ))} 
        </ul>
      </div>

      <div onClick={toggleBruger}>
        <Burger />
      </div>
    
    </nav>
  )
}

export default Navbar
