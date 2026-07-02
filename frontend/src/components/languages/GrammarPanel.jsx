// Nested breakdown of the targeted topic, recursing for deeper levels.
function Branch({ items }) {
  return (
    <ul className="mt-2 space-y-1 border-l border-borders pl-4">
      {items.map((it) => (
        <li key={it.title} className="text-gray">
          {it.title}
          {it.children && <Branch items={it.children} />}
        </li>
      ))}
    </ul>
  )
}

// Left-side detail for whichever flag is targeted.
function GrammarPanel({ topic }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-gray">grammar · English</p>
      <h2 className="mt-2 text-3xl font-black uppercase tracking-tight">{topic.title}</h2>
      {topic.children ? (
        <Branch items={topic.children} />
      ) : (
        <p className="mt-4 text-gray">Lesson content coming soon.</p>
      )}
    </div>
  )
}

export default GrammarPanel
