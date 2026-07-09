import { useState, useEffect, useCallback, useContext, createContext } from 'react';
import { Alert } from 'react-native';
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

const showError = (action, err) => {
  Alert.alert('Something went wrong', `Could not ${action}. ${err?.message || 'Check your connection and try again.'}`);
};

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
    try {
      const folder = await api('/flashcards/folders', { method: 'POST', body: { name } });
      setFolders((prev) => [...prev, { ...folder, topics: [] }]);
    } catch (err) {
      showError('create the folder', err);
    }
  };

  const deleteFolder = async (id) => {
    try {
      await api(`/flashcards/folders/${id}`, { method: 'DELETE' });
      setFolders((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      showError('delete the folder', err);
    }
  };

  const addTopic = async (folderId, name) => {
    try {
      const topic = await api(`/flashcards/folders/${folderId}/topics`, { method: 'POST', body: { name } });
      setFolders((prev) =>
        prev.map((f) =>
          f.id === folderId ? { ...f, topics: [...f.topics, { ...topic, cards: [] }] } : f
        )
      );
    } catch (err) {
      showError('create the topic', err);
    }
  };

  const deleteTopic = async (id) => {
    try {
      await api(`/flashcards/topics/${id}`, { method: 'DELETE' });
      setFolders((prev) =>
        prev.map((f) => ({ ...f, topics: f.topics.filter((t) => t.id !== id) }))
      );
    } catch (err) {
      showError('delete the topic', err);
    }
  };

  const addCard = async (topicId, front, back) => {
    try {
      const card = await api(`/flashcards/topics/${topicId}/cards`, { method: 'POST', body: { front, back } });
      setFolders((prev) =>
        prev.map((f) => ({
          ...f,
          topics: f.topics.map((t) =>
            t.id === topicId ? { ...t, cards: [...t.cards, card] } : t
          ),
        }))
      );
    } catch (err) {
      showError('save the card', err);
    }
  };

  const deleteCard = async (id) => {
    try {
      await api(`/flashcards/cards/${id}`, { method: 'DELETE' });
      setFolders((prev) =>
        prev.map((f) => ({
          ...f,
          topics: f.topics.map((t) => ({
            ...t,
            cards: t.cards.filter((c) => c.id !== id),
          })),
        }))
      );
    } catch (err) {
      showError('delete the card', err);
    }
  };

  return { folders, loading, addFolder, deleteFolder, addTopic, deleteTopic, addCard, deleteCard, refresh };
}
