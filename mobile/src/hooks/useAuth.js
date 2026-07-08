import { createContext, useContext, useState, useEffect } from 'react';
import { api, setToken, clearToken } from '../api/client';
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    SecureStore.getItemAsync('token')
      .then((token) => {
        if (!token) return null;
        return api('/auth/me');
      })
      .then((u) => setUser(u))
      .catch(() => clearToken())
      .finally(() => setReady(true));
  }, []);

  const signup = async (form) => {
    // POST /auth/signup → { needsVerification, email }
    const data = await api('/auth/signup', { method: 'POST', body: form });
    return data; // { email } (backend may omit needsVerification field)
  };

  const verify = async (email, code) => {
    // POST /auth/verify → { user, token }
    const data = await api('/auth/verify', { method: 'POST', body: { email, code } });
    await setToken(data.token);
    setUser(data.user);
  };

  const login = async ({ identifier, password }) => {
    // POST /auth/login → { user, token }
    // throws Error with message 'Email not verified' and status 403 if unverified
    const data = await api('/auth/login', { method: 'POST', body: { identifier, password } });
    await setToken(data.token);
    setUser(data.user);
  };

  const resend = async (email) => {
    await api('/auth/resend', { method: 'POST', body: { email } });
  };

  const logout = async () => {
    await clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, ready, signup, verify, login, resend, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
