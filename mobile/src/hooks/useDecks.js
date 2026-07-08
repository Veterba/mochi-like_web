import { useState, useEffect, useCallback, useContext, createContext } from 'react';
import { api } from '../api/client';

const DecksContext = createContext(null);

export function DecksProvider({ children }) {
  const decks = useDecksState();
  return <DecksContext.Provider value={decks}>{children}</DecksContext.Provider>;
}

export function useDecks() {
  const ctx = useContext(DecksContext);
  if (!ctx) throw new Error('useDecks must be used inside DecksProvider');
  return ctx;
}

function useDecksState() {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    api('/flashcards')
      .then(setFolders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addFolder = async (name) => {
    const folder = await api('/flashcards/folders', { method: 'POST', body: { name } }).catch(console.error);
    if (folder) setFolders((prev) => [...prev, { ...folder, topics: [] }]);
  };

  const deleteFolder = async (id) => {
    await api(`/flashcards/folders/${id}`, { method: 'DELETE' }).catch(console.error);
    setFolders((prev) => prev.filter((f) => f.id !== id));
  };

  const addTopic = async (folderId, name) => {
    const topic = await api(`/flashcards/folders/${folderId}/topics`, { method: 'POST', body: { name } }).catch(console.error);
    if (topic) {
      setFolders((prev) =>
        prev.map((f) =>
          f.id === folderId ? { ...f, topics: [...f.topics, { ...topic, cards: [] }] } : f
        )
      );
    }
  };

  const deleteTopic = async (id) => {
    await api(`/flashcards/topics/${id}`, { method: 'DELETE' }).catch(console.error);
    setFolders((prev) =>
      prev.map((f) => ({ ...f, topics: f.topics.filter((t) => t.id !== id) }))
    );
  };

  const addCard = async (topicId, front, back) => {
    const card = await api(`/flashcards/topics/${topicId}/cards`, { method: 'POST', body: { front, back } }).catch(console.error);
    if (card) {
      setFolders((prev) =>
        prev.map((f) => ({
          ...f,
          topics: f.topics.map((t) =>
            t.id === topicId ? { ...t, cards: [...t.cards, card] } : t
          ),
        }))
      );
    }
  };

  const deleteCard = async (id) => {
    await api(`/flashcards/cards/${id}`, { method: 'DELETE' }).catch(console.error);
    setFolders((prev) =>
      prev.map((f) => ({
        ...f,
        topics: f.topics.map((t) => ({
          ...t,
          cards: t.cards.filter((c) => c.id !== id),
        })),
      }))
    );
  };

  return { folders, loading, addFolder, deleteFolder, addTopic, deleteTopic, addCard, deleteCard, refresh };
}
