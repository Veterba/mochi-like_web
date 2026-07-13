import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth.jsx'

// Right-side navbar identity: avatar + username (link to profile) when signed
// in, otherwise the auth button. Visible on every breakpoint.
function ProfileChip({ onAuthClick }) {
  const { user } = useAuth()
  const { t } = useTranslation()

  if (!user) {
    return (
      <button type="button" onClick={onAuthClick} className="p-text">
        {t('nav.auth')}
      </button>
    )
  }

  return (
    <Link to="/profile" className="flex items-center gap-2">
      {user.avatar ? (
        <img src={user.avatar} alt="" className="h-8 w-8 shrink-0 border border-borders object-cover" />
      ) : (
        <div className="h-8 w-8 shrink-0 border border-borders bg-third-background" />
      )}
      <span className="max-w-[8rem] truncate">{user.nickname}</span>
    </Link>
  )
}

export default ProfileChip
