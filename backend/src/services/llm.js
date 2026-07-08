import { readFileSync } from 'node:fs'

const SYSTEM_PROMPT = readFileSync(new URL('../tutor-system-prompt.md', import.meta.url), 'utf8')

// Works with any OpenAI-compatible provider (OpenRouter, Google AI Studio,
// Groq, Alibaba Model Studio, ...) — set LLM_BASE_URL / LLM_API_KEY / LLM_MODEL in .env
export async function tutorReply(history) {
  const res = await fetch(`${process.env.LLM_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.LLM_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.LLM_MODEL,
      max_tokens: 1000,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...history.map(m => ({ role: m.role, content: m.content })),
      ],
    }),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    const err = new Error(`LLM request failed (${res.status}): ${detail.slice(0, 300)}`)
    err.status = res.status
    throw err
  }

  const data = await res.json()
  const content = data.choices?.[0]?.message?.content
  if (!content) throw new Error('LLM returned an empty response')
  return content
}
