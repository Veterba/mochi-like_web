import { useState, useEffect } from 'react'
import { useAuth } from './useAuth.jsx'
import { api } from '../api/client.js'

const seedLanguages = [
  { id: 'en', name: 'English', topics: [] },
  { id: 'de', name: 'German', topics: [] },
]

function filterLanguages(langs, query) {
  if (!query) return langs
  const q = query.toLowerCase()
  return langs.reduce((acc, lang) => {
    if (lang.name.toLowerCase().includes(q)) {
      acc.push(lang)
      return acc
    }
    const topics = lang.topics.filter((t) => t.name.toLowerCase().includes(q))
    if (topics.length) acc.push({ ...lang, topics })
    return acc
  }, [])
}

export default function useDecks() {
  const { user } = useAuth()
  const [languages, setLanguages] = useState(seedLanguages)
  const [selectedTopicId, setSelectedTopicId] = useState(null)
  const [query, setQuery] = useState('')
  const [trash, setTrash] = useState([])
  const [naming, setNaming] = useState(null)

  useEffect(() => {
    if (user) {
      api('/flashcards').then(setLanguages).catch(console.error)
    } else {
      setLanguages(seedLanguages)
    }
  }, [user])

  const visibleLanguages = filterLanguages(languages, query)
  const selectedTopic = languages.flatMap((l) => l.topics).find((t) => t.id === selectedTopicId)

  const submitName = async (name) => {
    if (!naming) return
    if (user) {
      if (naming.kind === 'language') {
        const folder = await api('/flashcards/folders', { method: 'POST', body: { name } }).catch(console.error)
        if (folder) setLanguages((prev) => [...prev, { ...folder, topics: [] }])
      } else {
        const topic = await api(`/flashcards/folders/${naming.langId}/topics`, { method: 'POST', body: { name } }).catch(console.error)
        if (topic) {
          setLanguages((prev) =>
            prev.map((l) =>
              l.id === naming.langId ? { ...l, topics: [...l.topics, { ...topic, cards: [] }] } : l
            )
          )
        }
      }
    } else {
      if (naming.kind === 'language') {
        setLanguages((prev) => [...prev, { id: crypto.randomUUID(), name, topics: [] }])
      } else {
        setLanguages((prev) =>
          prev.map((l) =>
            l.id === naming.langId
              ? { ...l, topics: [...l.topics, { id: crypto.randomUUID(), name, cards: [] }] }
              : l
          )
        )
      }
    }
    setNaming(null)
  }

  const addCard = async (front, back) => {
    if (user) {
      const card = await api(`/flashcards/topics/${selectedTopicId}/cards`, { method: 'POST', body: { front, back } }).catch(console.error)
      if (card) {
        setLanguages((prev) =>
          prev.map((l) => ({
            ...l,
            topics: l.topics.map((t) =>
              t.id === selectedTopicId ? { ...t, cards: [...t.cards, card] } : t
            ),
          }))
        )
      }
    } else {
      setLanguages((prev) =>
        prev.map((l) => ({
          ...l,
          topics: l.topics.map((t) =>
            t.id === selectedTopicId
              ? { ...t, cards: [...t.cards, { id: crypto.randomUUID(), front, back }] }
              : t
          ),
        }))
      )
    }
  }

  const deleteCard = async (cardId) => {
    const card = selectedTopic?.cards.find((c) => c.id === cardId)
    if (card) setTrash((t) => [...t, card])
    if (user) {
      await api(`/flashcards/cards/${cardId}`, { method: 'DELETE' }).catch(console.error)
    }
    setLanguages((prev) =>
      prev.map((l) => ({
        ...l,
        topics: l.topics.map((t) =>
          t.id === selectedTopicId ? { ...t, cards: t.cards.filter((c) => c.id !== cardId) } : t
        ),
      }))
    )
  }

  const deleteLanguage = async (langId) => {
    const lang = languages.find((l) => l.id === langId)
    const shouldClearTopic = lang?.topics.some((t) => t.id === selectedTopicId)
    if (user) {
      await api(`/flashcards/folders/${langId}`, { method: 'DELETE' }).catch(console.error)
    }
    if (shouldClearTopic) setSelectedTopicId(null)
    setLanguages((prev) => prev.filter((l) => l.id !== langId))
  }

  const deleteTopic = async (langId, topicId) => {
    if (user) {
      await api(`/flashcards/topics/${topicId}`, { method: 'DELETE' }).catch(console.error)
    }
    if (topicId === selectedTopicId) setSelectedTopicId(null)
    setLanguages((prev) =>
      prev.map((l) =>
        l.id === langId ? { ...l, topics: l.topics.filter((t) => t.id !== topicId) } : l
      )
    )
  }

  return {
    languages,
    visibleLanguages,
    query,
    setQuery,
    selectedTopicId,
    setSelectedTopicId,
    selectedTopic,
    naming,
    setNaming,
    submitName,
    addCard,
    deleteCard,
    deleteLanguage,
    deleteTopic,
    trash,
  }
}
