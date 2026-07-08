import { useEffect, useRef, useState } from 'react'
import Navbar from '../sections/Navbar.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import useTutor from '../hooks/useTutor.js'
import useRecorder from '../hooks/useRecorder.js'

function Tutor() {
  const { user } = useAuth()
  const {
    chats, activeChatId, setActiveChatId,
    messages, sending, assessing, error,
    newChat, deleteChat, sendMessage, assessPronunciation,
  } = useTutor()
  const { recording, start, stop } = useRecorder()
  const [input, setInput] = useState('')
  const [pendingAudio, setPendingAudio] = useState(null)
  const [pendingText, setPendingText] = useState('')
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

  const handleMic = async () => {
    if (!activeChatId) return
    if (recording) {
      try {
        const audioData = await stop()
        if (input.trim()) {
          const text = input.trim()
          setInput('')
          assessPronunciation(text, audioData)
        } else {
          setPendingAudio(audioData)
        }
      } catch { /* permission denied — mic button just resets */ }
    } else {
      try {
        await start()
      } catch { /* permission denied */ }
    }
  }

  const handlePendingSubmit = (e) => {
    e.preventDefault()
    if (!pendingText.trim() || !pendingAudio) return
    const text = pendingText.trim()
    const audioData = pendingAudio
    setPendingAudio(null)
    setPendingText('')
    assessPronunciation(text, audioData)
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
        <aside className="flex flex-col gap-3">
          <button
            type="button"
            onClick={newChat}
            className="border border-borders bg-background px-4 py-2 text-left text-sm font-semibold uppercase hover:bg-text hover:text-background"
          >
            + New chat
          </button>
          <ul className="flex flex-col overflow-y-auto border border-borders bg-background">
            {chats.map((chat) => (
              <li key={chat.id} className="group flex items-center border-b border-borders last:border-b-0">
                <button
                  type="button"
                  onClick={() => setActiveChatId(chat.id)}
                  className={`flex-1 truncate px-4 py-2 text-left text-sm ${
                    chat.id === activeChatId ? 'bg-accent-background' : 'hover:bg-third-background'
                  }`}
                >
                  {chat.title}
                </button>
                <button
                  type="button"
                  onClick={() => deleteChat(chat.id)}
                  className="px-2 font-bold text-gray opacity-0 hover:text-accent-2 group-hover:opacity-100"
                  aria-label="Delete chat"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* conversation */}
        <section className="flex flex-col border border-borders bg-background">
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
                  className={`max-w-[80%] whitespace-pre-wrap border border-borders px-4 py-3 text-sm ${
                    m.role === 'user'
                      ? 'self-end bg-accent-background'
                      : 'self-start bg-third-background'
                  }`}
                >
                  {m.content}
                </li>
              ))}
              {sending && (
                <li className="self-start border border-borders bg-third-background px-4 py-3 text-sm text-gray">
                  Tutor is typing…
                </li>
              )}
            </ul>
            {error && <p className="mt-4 text-center text-sm text-accent-2">{error}</p>}
            <div ref={bottomRef} />
          </div>

          {activeChatId && pendingAudio && (
            <form onSubmit={handlePendingSubmit} className="flex items-center gap-2 border-t border-borders bg-third-background px-4 py-3">
              <span className="shrink-0 text-sm text-gray">What sentence did you say?</span>
              <input
                value={pendingText}
                onChange={(e) => setPendingText(e.target.value)}
                autoFocus
                className="flex-1 border border-borders bg-background px-3 py-1 text-sm outline-none focus:border-second-borders"
              />
              <button
                type="submit"
                disabled={!pendingText.trim()}
                className="border border-borders bg-text px-3 py-1 text-xs font-semibold uppercase text-background hover:bg-background hover:text-text disabled:opacity-40"
              >
                Assess
              </button>
              <button
                type="button"
                onClick={() => { setPendingAudio(null); setPendingText('') }}
                className="text-sm text-gray hover:text-accent-2"
                aria-label="Cancel"
              >
                ✕
              </button>
            </form>
          )}

          {activeChatId && (
            <form onSubmit={handleSend} className="flex gap-3 border-t border-borders p-4">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Write in the language you're learning…"
                maxLength={4000}
                className="flex-1 border border-borders bg-background px-4 py-2 outline-none focus:border-second-borders"
              />
              <button
                type="button"
                onClick={handleMic}
                disabled={assessing}
                className={`border border-borders px-3 py-2 text-sm font-semibold uppercase disabled:opacity-40 ${
                  recording
                    ? 'border-accent-2 bg-accent-2 text-white'
                    : 'bg-background text-text hover:bg-third-background'
                }`}
                title={recording ? 'recording… tap to stop' : 'record pronunciation'}
              >
                {assessing ? 'assessing…' : recording ? '● stop' : 'mic'}
              </button>
              <button
                type="submit"
                disabled={sending || !input.trim()}
                className="border border-borders bg-text px-5 py-2 text-sm font-semibold uppercase text-background hover:bg-background hover:text-text disabled:opacity-40"
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
