import { useState, useEffect } from 'react';
import { api } from '../api/client';

export function dateKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function useActivity() {
  const [days, setDays] = useState([]);

  useEffect(() => {
    api('/activity').then(setDays).catch(() => {});
  }, []);

  const markActiveToday = () => {
    const key = dateKey();
    setDays((prev) => (prev.includes(key) ? prev : [...prev, key]));
    api('/activity', { method: 'POST' }).catch(() => {});
  };

  return { days, markActiveToday };
}

// Marks today active once on mount.
export function useMarkActiveToday() {
  const { markActiveToday } = useActivity();
  useEffect(() => {
    markActiveToday();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
