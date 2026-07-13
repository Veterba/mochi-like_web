import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth.jsx'

function NavLinkRight() {
  const { user, logout } = useAuth()
  const { t } = useTranslation()

  return (
    <ul className="flex items-center gap-8">
      {user && (
        <li className="p-text">
          <button type="button" onClick={logout}>{t('nav.logout')}</button>
        </li>
      )}
      <li className="p-text">
        <Link to="/tutor">{t('nav.tutor')}</Link>
      </li>
      <li className="p-text">
        <a href="#blog">{t('nav.blog')}</a>
      </li>
    </ul>
  )
}

export default NavLinkRight
