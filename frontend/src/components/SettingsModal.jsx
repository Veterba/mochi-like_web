import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSettings } from '../hooks/useSettings.jsx'
import { LLM_PROVIDERS } from '../assets/llmProviders.js'

const MODES = ['light', 'auto', 'dark']

function SettingsModal({ onClose }) {
  const { t } = useTranslation()
  const { mode, setMode, llm, setLlm } = useSettings()

  // Local LLM draft — committed on Save. Mode applies immediately.
  const [provider, setProvider] = useState(llm.provider || 'default')
  const [model, setModel] = useState(llm.model || '')
  const [apiKey, setApiKey] = useState(llm.apiKey || '')

  const preset = LLM_PROVIDERS.find((p) => p.id === provider) ?? LLM_PROVIDERS[0]

  const handleProviderSelect = (id) => {
    setProvider(id)
    const p = LLM_PROVIDERS.find((p) => p.id === id)
    setModel(p?.models[0] ?? '')
    if (id === 'default') setApiKey('')
  }

  const handleSave = () => {
    setLlm({ provider, model, apiKey })
    onClose()
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] w-full max-w-md overflow-y-auto border border-borders bg-background p-8"
      >
        <h3 className="mb-6 text-xs uppercase tracking-widest text-gray">{t('settings.title')}</h3>

        {/* Appearance */}
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-text">{t('settings.appearance')}</p>
        <div className="mb-8 flex border border-borders">
          {MODES.map((m, i) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest ${
                i > 0 ? 'border-l border-borders' : ''
              } ${mode === m ? 'bg-text text-background' : 'text-text'}`}
            >
              {t(`settings.${m}`)}
            </button>
          ))}
        </div>

        {/* AI Provider */}
        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-text">{t('settings.aiProvider')}</p>
        <p className="mb-3 text-xs text-gray">{t('settings.providerHint')}</p>

        <div className="mb-4 flex flex-wrap gap-2">
          {LLM_PROVIDERS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => handleProviderSelect(p.id)}
              className={`border px-3 py-1.5 text-xs font-bold uppercase tracking-wide ${
                provider === p.id
                  ? 'border-text bg-text text-background'
                  : 'border-second-gray text-gray'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {provider !== 'default' && preset.models.length > 0 && (
          <>
            <p className="mb-2 text-xs uppercase tracking-widest text-gray">{t('settings.model')}</p>
            <div className="mb-4 flex flex-wrap gap-2">
              {preset.models.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setModel(m)}
                  className={`border px-2.5 py-1 text-xs ${
                    model === m ? 'border-text text-text' : 'border-second-gray text-gray'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </>
        )}

        {provider !== 'default' && (
          <>
            <p className="mb-2 text-xs uppercase tracking-widest text-gray">{t('settings.apiKey')}</p>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-…"
              className="mb-4 w-full border border-borders bg-transparent px-3 py-2 text-sm text-text outline-none"
            />
          </>
        )}

        <div className="mt-2 flex gap-3">
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 border border-borders px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-text hover:text-background"
          >
            {t('settings.save')}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-borders px-4 py-2 text-xs font-bold uppercase tracking-widest text-gray hover:bg-third-background"
          >
            {t('settings.cancel')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettingsModal
