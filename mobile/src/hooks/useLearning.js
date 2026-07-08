import { useState, useEffect } from 'react';
import { api } from '../api/client';

// Per-language learning status. Shape: { [languageName]: "learning" | "completed" }
export default function useLearning() {
  const [statuses, setStatuses] = useState({});

  useEffect(() => {
    api('/learning')
      .then((arr) => setStatuses(Object.fromEntries(arr.map((r) => [r.language, r.status]))))
      .catch(() => {});
  }, []);

  const setStatus = (lang, status) => {
    setStatuses((prev) => ({ ...prev, [lang]: status }));
    api(`/learning/${encodeURIComponent(lang)}`, { method: 'PUT', body: { status } }).catch(() => {});
  };

  const remove = (lang) => {
    setStatuses((prev) => {
      const next = { ...prev };
      delete next[lang];
      return next;
    });
    api(`/learning/${encodeURIComponent(lang)}`, { method: 'DELETE' }).catch(() => {});
  };

  return { statuses, setStatus, remove };
}
