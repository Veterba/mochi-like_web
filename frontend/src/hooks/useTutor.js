import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './useAuth.jsx'
import { api } from '../api/client.js'

// Tutor chat state: list of chats + messages of the active chat.
// The assistant reply comes back from POST /tutor/chats/:id/messages,
// which can take a few seconds — `sending` covers that window.
export default function useTutor() {
  const { user } = useAuth()
  const [chats, setChats] = useState([])
  const [activeChatId, setActiveChatId] = useState(null)
  const [messages, setMessages] = useState([])
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) return
    api('/tutor/chats').then((list) => {
      setChats(list)
      if (list.length > 0) setActiveChatId(list[0].id)
    }).catch(() => {})
  }, [user])

  useEffect(() => {
    if (!activeChatId) {
      setMessages([])
      return
    }
    api(`/tutor/chats/${activeChatId}/messages`).then(setMessages).catch(() => {})
  }, [activeChatId])

  const newChat = useCallback(async () => {
    const chat = await api('/tutor/chats', { method: 'POST' })
    setChats((prev) => [chat, ...prev])
    setActiveChatId(chat.id)
  }, [])

  const deleteChat = useCallback(async (id) => {
    await api(`/tutor/chats/${id}`, { method: 'DELETE' })
    setChats((prev) => prev.filter((c) => c.id !== id))
    setActiveChatId((prev) => (prev === id ? null : prev))
  }, [])

  const sendMessage = useCallback(async (content) => {
    if (!activeChatId || sending) return
    setError(null)
    setSending(true)
    setMessages((prev) => [...prev, { id: `tmp-${Date.now()}`, role: 'user', content }])
    setChats((prev) => prev.map((c) =>
      c.id === activeChatId && c.title === 'New chat' ? { ...c, title: content.slice(0, 40) } : c
    ))
    try {
      const reply = await api(`/tutor/chats/${activeChatId}/messages`, {
        method: 'POST',
        body: { content },
      })
      setMessages((prev) => [...prev, reply])
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }, [activeChatId, sending])

  return {
    chats, activeChatId, setActiveChatId,
    messages, sending, error,
    newChat, deleteChat, sendMessage,
  }
}
