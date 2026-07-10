import { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { setLlmConfig } from '../api/client';
import { resolveOverride } from '../assets/llmProviders';

const SETTINGS_KEY = 'settings';

const DEFAULT_SETTINGS = {
  mode: 'auto',
  llm: { provider: 'default', model: '', apiKey: '' },
};

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [mode, setModeState] = useState('auto');
  const [llm, setLlmState] = useState(DEFAULT_SETTINGS.llm);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    SecureStore.getItemAsync(SETTINGS_KEY)
      .then((raw) => {
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.mode) setModeState(parsed.mode);
          if (parsed.llm) {
            setLlmState(parsed.llm);
            setLlmConfig(resolveOverride(parsed.llm));
          }
        }
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  const persist = (next) => {
    SecureStore.setItemAsync(SETTINGS_KEY, JSON.stringify(next)).catch(() => {});
  };

  const setMode = (m) => {
    setModeState(m);
    persist({ mode: m, llm });
  };

  const setLlm = (l) => {
    setLlmState(l);
    setLlmConfig(resolveOverride(l));
    persist({ mode, llm: l });
  };

  return (
    <SettingsContext.Provider value={{ mode, setMode, llm, setLlm, ready }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
