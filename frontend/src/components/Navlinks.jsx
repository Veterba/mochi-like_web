import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth.jsx'

function NavLinkRight({ onAuthClick }) {
  const { user, logout } = useAuth()
  const { t } = useTranslation()

  return (
    <div>
      <ul className="flex gap-12">
        <li className="app__flex p-text">
          <div />
          {user ? (
            <span className="flex items-center gap-12">
              <Link to="/profile">{user.nickname}</Link>
              <button type="button" onClick={logout}>{t('nav.logout')}</button>
            </span>
          ) : (
            <button type="button" onClick={onAuthClick}>{t('nav.auth')}</button>
          )}
        </li>
        <li className="app__flex p-text">
          <div />
          <Link to="/tutor">{t('nav.tutor')}</Link>
        </li>
        <li className="app__flex p-text">
          <div />
          <a href="#blog">{t('nav.blog')}</a>
        </li>
      </ul>
    </div>
  )
}

export default NavLinkRight
