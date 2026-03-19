import { getCached, setCached } from '../utils/cache'

export async function countGeminiTokens(apiKey: string, model: string, text: string) {
  const cacheKey = `gemini:count:${model}:${text}`
  const cached = getCached(cacheKey)
  if (cached) {
    return cached
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:countTokens?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text }],
          },
        ],
      }),
    },
  )

  if (!response.ok) {
    throw new Error(`Gemini countTokens failed: ${response.status}`)
  }

  const data = (await response.json()) as { totalTokens?: number }
  const normalized = {
    vendor: 'google',
    model,
    tokenCount: data.totalTokens ?? 0,
    raw: data,
  }
  setCached(cacheKey, normalized)
  return normalized
}

export async function listGeminiTokens(apiKey: string, model: string, text: string) {
  const cacheKey = `gemini:list:${model}:${text}`
  const cached = getCached(cacheKey)
  if (cached) {
    return cached
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:tokenizeContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text }],
          },
        ],
      }),
    },
  )

  if (!response.ok) {
    throw new Error(`Gemini tokenizeContent failed: ${response.status}`)
  }

  const data = (await response.json()) as { tokens?: unknown[] }
  const normalized = {
    vendor: 'google',
    model,
    tokens: data.tokens ?? [],
    raw: data,
  }
  setCached(cacheKey, normalized)
  return normalized
}
