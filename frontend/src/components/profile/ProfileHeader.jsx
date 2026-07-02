import useProfile from "../../hooks/useProfile.js"
import usePopup from "../../hooks/usePopup.js"
import EditProfile from "./EditProfile.jsx"

function ProfileHeader() {
  const { nickname, avatar, update } = useProfile()
  const editor = usePopup()

  return (
    <aside className="flex flex-col gap-4 border border-borders p-6">
      {avatar ? (
        <img src={avatar} alt="" className="h-24 w-24 border border-borders object-cover" />
      ) : (
        <div className="h-24 w-24 border border-borders bg-third-background" />
      )}
      <div>
        <h2 className="text-2xl font-bold">{nickname}</h2>
        <p className="text-sm text-gray">{nickname}</p>
      </div>
      <div className="flex gap-4 text-sm text-gray">
        <span>
          <span className="text-text">0</span> Following
        </span>
        <span>
          <span className="text-text">0</span> Followers
        </span>
      </div>
      <button
        type="button"
        onClick={() => editor.open(true)}
        className="mt-2 border border-accent-3 px-4 py-2 text-sm font-semibold uppercase text-accent-3 hover:bg-accent-3 hover:text-background"
      >
        Edit Profile
      </button>

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
    </aside>
  )
}

export default ProfileHeader
