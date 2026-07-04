import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './hooks/useAuth.jsx'
import Homepage from './pages/Homepage.jsx'
import Flashcards from './pages/Flashcards.jsx'
import Languages from './pages/Languages.jsx'
import LanguagePage from './pages/LanguagePage.jsx'
import Profile from './pages/Profile.jsx'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="bg-background text-text">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/flashcards" element={<Flashcards />} />
            <Route path="/languages" element={<Languages />} />
            <Route path="/languages/:slug" element={<LanguagePage />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
