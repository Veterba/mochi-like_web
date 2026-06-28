function PopUp({ isOpen, onClose, children }) {
  if (!isOpen) return null

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-white p-12 shadow-l"
      >
        <button type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          x
        </button>
        {children}
      </div>
    </div>
  ) 
}

export default PopUp
