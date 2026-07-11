/* eslint-disable react/only-export-components -- context file exports both provider component and hook */
import { createContext, useContext, useEffect, useState } from 'react'
import { setLlmConfig } from '../api/client.js'
import { resolveOverride } from '../assets/llmProviders.js'

const KEY = 'settings'
const DEFAULT = { mode: 'auto', llm: { provider: 'default', model: '', apiKey: '' } }

function read() {
  try {
    return { ...DEFAULT, ...(JSON.parse(localStorage.getItem(KEY)) || {}) }
  } catch {
    return DEFAULT
  }
}

// Resolve 'auto' against the OS preference; light/dark are explicit.
function resolveScheme(mode) {
  if (mode === 'auto') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return mode
}

function applyScheme(scheme) {
  document.documentElement.classList.toggle('dark', scheme === 'dark')
}

const SettingsContext = createContext(null)

export function SettingsProvider({ children }) {
  const [mode, setModeState] = useState(() => read().mode)
  const [llm, setLlmState] = useState(() => read().llm)

  // Push the stored LLM override into the api client on mount.
  useEffect(() => {
    setLlmConfig(resolveOverride(llm))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Apply the theme class, re-evaluating on OS changes while in 'auto'.
  useEffect(() => {
    applyScheme(resolveScheme(mode))
    if (mode !== 'auto') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyScheme(resolveScheme('auto'))
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [mode])

  const persist = (next) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(next))
    } catch {
      // ignore
    }
  }

  const setMode = (m) => {
    setModeState(m)
    persist({ mode: m, llm })
  }

  const setLlm = (l) => {
    setLlmState(l)
    setLlmConfig(resolveOverride(l))
    persist({ mode, llm: l })
  }

  return (
    <SettingsContext.Provider value={{ mode, setMode, llm, setLlm }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  return useContext(SettingsContext)
}
