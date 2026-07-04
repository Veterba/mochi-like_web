const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export async function api(path, { method, body } = {}) {
  const res = await fetch(BASE + path, {
    method,
    credentials: 'include',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Request failed')
  return res.status === 204 ? null : res.json()
}
