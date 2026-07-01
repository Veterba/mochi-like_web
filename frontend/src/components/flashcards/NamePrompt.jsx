import { useState } from "react"

function NamePrompt({ title, onSubmit, onClose }) {
  const [name, setName] = useState("")
  const canSave = name.trim().length > 0

  const submit = (e) => {
    e.preventDefault()
    if (canSave) onSubmit(name.trim())
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6 backdrop-blur-sm"
    >
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm border border-borders bg-background p-6"
      >
        <h3 className="mb-4 text-sm uppercase tracking-widest text-gray">{title}</h3>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="w-full border border-borders bg-background px-3 py-2 text-sm text-text outline-none focus:ring-1 focus:ring-text"
        />
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="border border-borders px-4 py-1 text-sm hover:bg-text hover:text-background"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canSave}
            className="border border-borders bg-text px-4 py-1 text-sm text-background hover:bg-background hover:text-text disabled:opacity-40 disabled:hover:bg-text disabled:hover:text-background"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  )
}

export default NamePrompt
