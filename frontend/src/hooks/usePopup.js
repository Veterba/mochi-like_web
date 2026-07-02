import { useState } from "react"

// Tracks which item's popup is open (null = closed). Keeps the open/close
// state out of the component so the JSX stays presentational.
export default function usePopup() {
  const [selected, setSelected] = useState(null)
  return {
    selected,
    isOpen: selected != null,
    open: setSelected,
    close: () => setSelected(null),
  }
}
