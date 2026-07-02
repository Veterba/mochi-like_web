// A right-anchored flag banner. Lengthens on hover; fills solid when it is
// the targeted topic. Selection lives in the parent.
function Flag({ index, topic, accent, active, onSelect }) {
  return (
    <li className="flex w-full justify-end">
      <button
        type="button"
        onClick={onSelect}
        className={`flex w-[80%] items-center justify-end gap-3 border-2 py-2 pl-8 pr-4 text-right uppercase tracking-tight transition-[width] duration-300 ease-out hover:w-full ${
          active ? "border-text bg-text text-background" : `${accent} text-text`
        }`}
      >
        <span className="font-bold">{topic.title}</span>
        <span className="text-xs opacity-60">{String(index + 1).padStart(2, "0")}</span>
      </button>
    </li>
  )
}

export default Flag
