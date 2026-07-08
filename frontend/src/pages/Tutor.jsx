import { useEffect, useRef, useState } from 'react'
import Navbar from '../sections/Navbar.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import useTutor from '../hooks/useTutor.js'

function Tutor() {
  const { user } = useAuth()
  const {
    chats, activeChatId, setActiveChatId,
    messages, sending, error,
    newChat, deleteChat, sendMessage,
  } = useTutor()
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, sending])

  const handleSend = (e) => {
    e.preventDefault()
    const content = input.trim()
    if (!content || sending) return
    setInput('')
    sendMessage(content)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-third-background">
        <Navbar sticky />
        <p className="mx-auto max-w-xl px-6 py-24 text-center text-gray">
          Log in to chat with your writing tutor.
        </p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-third-background">
      <Navbar sticky />
      <div className="mx-auto grid w-full max-w-6xl flex-1 gap-6 px-6 py-8 md:grid-cols-[240px_1fr]">

        {/* chat list */}
        <aside className="flex flex-col gap-2">
          <button
            type="button"
            onClick={newChat}
            className="rounded-lg border border-second-gray bg-background px-4 py-2 text-left font-medium hover:bg-accent-background"
          >
            + New chat
          </button>
          <ul className="flex flex-col gap-1 overflow-y-auto">
            {chats.map((chat) => (
              <li key={chat.id} className="group flex items-center">
                <button
                  type="button"
                  onClick={() => setActiveChatId(chat.id)}
                  className={`flex-1 truncate rounded-lg px-4 py-2 text-left text-sm ${
                    chat.id === activeChatId ? 'bg-accent-background' : 'hover:bg-background'
                  }`}
                >
                  {chat.title}
                </button>
                <button
                  type="button"
                  onClick={() => deleteChat(chat.id)}
                  className="px-2 text-gray opacity-0 group-hover:opacity-100"
                  aria-label="Delete chat"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* conversation */}
        <section className="flex flex-col rounded-xl border border-second-gray bg-background">
          <div className="flex-1 overflow-y-auto p-6">
            {!activeChatId && (
              <p className="py-16 text-center text-gray">
                Start a new chat and write something in the language you're learning —
                your tutor will correct you and explain the mistakes.
              </p>
            )}
            {activeChatId && messages.length === 0 && !sending && (
              <p className="py-16 text-center text-gray">
                Write your first sentence — any topic is fine.
              </p>
            )}
            <ul className="flex flex-col gap-4">
              {messages.map((m) => (
                <li
                  key={m.id}
                  className={`max-w-[80%] whitespace-pre-wrap rounded-xl px-4 py-3 text-sm ${
                    m.role === 'user'
                      ? 'self-end bg-accent-background'
                      : 'self-start bg-third-background'
                  }`}
                >
                  {m.content}
                </li>
              ))}
              {sending && (
                <li className="self-start rounded-xl bg-third-background px-4 py-3 text-sm text-gray">
                  Tutor is typing…
                </li>
              )}
            </ul>
            {error && <p className="mt-4 text-center text-sm text-red-500">{error}</p>}
            <div ref={bottomRef} />
          </div>

          {activeChatId && (
            <form onSubmit={handleSend} className="flex gap-2 border-t border-second-gray p-4">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Write in the language you're learning…"
                maxLength={4000}
                className="flex-1 rounded-lg border border-second-gray bg-background px-4 py-2 outline-none"
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                className="rounded-lg bg-text px-5 py-2 text-background disabled:opacity-40"
              >
                Send
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  )
}

export default Tutor
