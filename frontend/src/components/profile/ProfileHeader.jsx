import { useTranslation } from "react-i18next"
import { useAuth } from "../../hooks/useAuth.jsx"
import useProfile from "../../hooks/useProfile.js"
import usePopup from "../../hooks/usePopup.js"
import EditProfile from "./EditProfile.jsx"

function ProfileHeader({ onSettings }) {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const { nickname, avatar, update } = useProfile()
  const editor = usePopup()

  return (
    <div className="flex items-center gap-4 border border-borders p-4 sm:p-6">
      {avatar ? (
        <img src={avatar} alt="" className="h-16 w-16 shrink-0 border border-borders object-cover" />
      ) : (
        <div className="h-16 w-16 shrink-0 border border-borders bg-third-background" />
      )}
      <div className="min-w-0 flex-1">
        <h2 className="truncate text-xl font-black uppercase tracking-tight">{nickname}</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => editor.open(true)}
            className="border border-accent-3 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-accent-3 hover:bg-accent-3 hover:text-background"
          >
            {t("profile.editProfile")}
          </button>
          {user && (
            <button
              type="button"
              onClick={logout}
              className="border border-accent-2 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-accent-2 hover:bg-accent-2 hover:text-background"
            >
              {t("profile.logout")}
            </button>
          )}
          <button
            type="button"
            onClick={onSettings}
            aria-label={t("profile.settings")}
            className="border border-borders px-3 py-1 text-[10px] font-bold uppercase tracking-widest hover:bg-text hover:text-background"
          >
            ⚙
          </button>
        </div>
      </div>

      {editor.isOpen && (
        <EditProfile
          nickname={nickname}
          avatar={avatar}
          onSave={(patch) => {
            update(patch)
            editor.close()
          }}
          onClose={editor.close}
        />
      )}
    </div>
  )
}

export default ProfileHeader
