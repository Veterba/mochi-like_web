import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'

function NavLinkRight({ onAuthClick }) {
  const { user, logout } = useAuth()

  return (
    <div>
      <ul className="flex gap-12">
        <li className="app__flex p-text">
          <div />
          {user ? (
            <span className="flex items-center gap-4">
              <Link to="/profile">{user.nickname}</Link>
              <button type="button" onClick={logout}>logout</button>
            </span>
          ) : (
            <button type="button" onClick={onAuthClick}>auth</button>
          )}
        </li>
        <li className="app__flex p-text">
          <div />
          <a href="#blog">blog</a>
        </li>
      </ul>
    </div>
  )
}

export default NavLinkRight
