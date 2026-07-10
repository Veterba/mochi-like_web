export const LLM_PROVIDERS = [
  { id: 'default', label: 'Default (app)', baseUrl: null, models: [] },
  {
    id: 'openai',
    label: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4.1', 'gpt-4.1-mini', 'o4-mini'],
  },
  {
    id: 'groq',
    label: 'Groq',
    baseUrl: 'https://api.groq.com/openai/v1',
    models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'],
  },
  {
    id: 'openrouter',
    label: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    models: ['openai/gpt-4o', 'anthropic/claude-3.5-sonnet', 'meta-llama/llama-3.3-70b-instruct'],
  },
  {
    id: 'google',
    label: 'Google',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
    models: ['gemini-2.0-flash', 'gemini-1.5-pro'],
  },
  {
    id: 'mistral',
    label: 'Mistral',
    baseUrl: 'https://api.mistral.ai/v1',
    models: ['mistral-large-latest', 'mistral-small-latest'],
  },
];

// Returns the override object to pass to the api client, or null for default.
export function resolveOverride(llm) {
  if (!llm || llm.provider === 'default') return null;
  const preset = LLM_PROVIDERS.find((p) => p.id === llm.provider);
  if (!preset) return null;
  return {
    baseUrl: preset.baseUrl,
    apiKey: llm.apiKey || '',
    model: llm.model || preset.models[0] || '',
  };
}
