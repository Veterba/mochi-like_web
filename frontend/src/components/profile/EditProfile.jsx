import { XIcon } from "../flashcards/Icons.jsx"
import useEditProfileForm from "../../hooks/useEditProfileForm.js"

function EditProfile({ nickname, avatar, onSave, onClose }) {
  const form = useEditProfileForm({ nickname, avatar })

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm border border-borders bg-background p-8"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-text hover:text-gray"
        >
          <XIcon />
        </button>
        <h3 className="mb-6 text-sm uppercase tracking-widest text-gray">Edit profile</h3>

        <div className="flex flex-col items-center gap-3">
          {form.avatar ? (
            <img src={form.avatar} alt="" className="h-24 w-24 border border-borders object-cover" />
          ) : (
            <div className="h-24 w-24 border border-borders bg-third-background" />
          )}
          <label className="cursor-pointer border border-borders px-3 py-1 text-xs uppercase hover:bg-text hover:text-background">
            Change photo
            <input
              type="file"
              accept="image/*"
              onChange={(e) => form.pickPhoto(e.target.files[0])}
              className="hidden"
            />
          </label>
        </div>

        <label className="mt-6 block text-xs uppercase tracking-widest text-gray">Nickname</label>
        <input
          value={form.nickname}
          onChange={(e) => form.setNickname(e.target.value)}
          className="mt-2 w-full border border-borders bg-transparent px-3 py-2 text-text outline-none"
        />

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={() => onSave({ nickname: form.nickname.trim() || "Guest", avatar: form.avatar })}
            className="flex-1 border border-borders px-4 py-2 text-sm uppercase hover:bg-text hover:text-background"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-borders px-4 py-2 text-sm uppercase text-gray hover:bg-third-background"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditProfile
