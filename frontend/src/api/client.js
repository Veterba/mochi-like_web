const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Set by useSettings when the user configures a custom LLM provider.
let llmOverride = null
export function setLlmConfig(o) { llmOverride = o }

export async function api(path, { method, body } = {}) {
  const headers = {}
  if (body) headers['Content-Type'] = 'application/json'
  if (llmOverride) {
    if (llmOverride.baseUrl) headers['x-llm-base-url'] = llmOverride.baseUrl
    if (llmOverride.apiKey) headers['x-llm-api-key'] = llmOverride.apiKey
    if (llmOverride.model) headers['x-llm-model'] = llmOverride.model
  }

  const res = await fetch(BASE + path, {
    method,
    credentials: 'include',
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Request failed')
  return res.status === 204 ? null : res.json()
}
