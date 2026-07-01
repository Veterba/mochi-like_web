import { useState } from "react"

function CardEditor({ onSave, onClose }) {
  const [front, setFront] = useState("")
  const [back, setBack] = useState("")
  const canSave = front.trim().length > 0

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg border border-borders bg-background"
      >
        <div className="flex items-center justify-between border-b border-borders p-4">
          <button type="button" onClick={onClose} className="text-sm text-gray hover:text-text">
            Cancel
          </button>
          <button
            type="button"
            disabled={!canSave}
            onClick={() => onSave(front.trim(), back.trim())}
            className="border border-borders px-4 py-1 text-sm hover:bg-text hover:text-background disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-text"
          >
            Save
          </button>
        </div>

        <div className="space-y-4 p-6">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-gray">Front</label>
            <textarea
              value={front}
              onChange={(e) => setFront(e.target.value)}
              rows={3}
              placeholder="Card name / front side"
              className="w-full border border-borders bg-background p-3 text-sm outline-none focus:ring-1 focus:ring-text"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-gray">Back</label>
            <textarea
              value={back}
              onChange={(e) => setBack(e.target.value)}
              rows={3}
              placeholder="Hidden side"
              className="w-full border border-borders bg-background p-3 text-sm outline-none focus:ring-1 focus:ring-text"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardEditor
