import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { api } from '../api/client';

export default function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    nickname: user?.nickname ?? 'Guest',
    avatar: user?.avatar ?? null,
  });

  useEffect(() => {
    api('/profile')
      .then((data) => setProfile({ nickname: data.nickname ?? 'Guest', avatar: data.avatar ?? null }))
      .catch(() => {});
  }, []);

  const update = async (patch) => {
    const updated = await api('/profile', { method: 'PATCH', body: patch });
    setProfile((p) => ({ ...p, ...updated }));
  };

  return { ...profile, update };
}
