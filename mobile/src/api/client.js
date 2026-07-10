import * as SecureStore from 'expo-secure-store';

// NOTE: the backend defaults to port 4200 (backend/src/index.js). On a real
// device "localhost" is the phone itself — set EXPO_PUBLIC_API_URL in
// mobile/.env to your computer's LAN IP, e.g. http://192.168.1.20:4200/api,
// then restart the dev server with `npx expo start -c` (env vars are baked
// into the JS bundle at build time; a reload is not enough).
const BASE = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4200/api';
const TOKEN_KEY = 'token';

// Set by useSettings when the user configures a custom LLM provider.
let llmOverride = null;
export function setLlmConfig(o) { llmOverride = o; }

export async function setToken(token) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function clearToken() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function api(path, { method, body } = {}) {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);

  const headers = {};
  if (body) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;

  if (llmOverride) {
    if (llmOverride.baseUrl) headers['x-llm-base-url'] = llmOverride.baseUrl;
    if (llmOverride.apiKey) headers['x-llm-api-key'] = llmOverride.apiKey;
    if (llmOverride.model) headers['x-llm-model'] = llmOverride.model;
  }

  let res;
  try {
    res = await fetch(BASE + path, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    // fetch rejects with a bare "Network request failed" — say which URL so
    // wrong IP/port in EXPO_PUBLIC_API_URL is diagnosable from the error.
    throw Object.assign(
      new Error(`Can't reach the server at ${BASE}. Check that the backend is running and EXPO_PUBLIC_API_URL is correct.`),
      { cause: err, network: true }
    );
  }

  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw Object.assign(new Error(json.error || 'Request failed'), { status: res.status });
  }

  return res.status === 204 ? null : res.json();
}
