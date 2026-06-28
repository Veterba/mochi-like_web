import { useState } from "react"
import PopUp from "../components/PopUp.jsx"

function Card() { 

const [open, setOpen] = useState(false)

  return (
    <>
      <button onClick={() => setOpen(true)} type="button" className="">
        Open
      </button> 
      <PopUp isOpen={open} onClose={() => setOpen(false)}>
        <h1>Test</h1>
      </PopUp>
    </>
  ) 
}

export default Card
