import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Homepage from './pages/Homepage.jsx'
import Flashcards from './pages/Flashcards.jsx'

function App() {
  return (
    <BrowserRouter>
      <div className="bg-background text-text">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/flashcards" element={<Flashcards />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
