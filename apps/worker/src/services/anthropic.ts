import { getCached, setCached } from '../utils/cache'

export async function countAnthropicTokens(apiKey: string, model: string, text: string) {
  const cacheKey = `anthropic:count:${model}:${text}`
  const cached = getCached(cacheKey)
  if (cached) {
    return cached
  }

  const response = await fetch('https://api.anthropic.com/v1/messages/count_tokens', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'user',
          content: text,
        },
      ],
    }),
  })

  if (!response.ok) {
    throw new Error(`Anthropic count_tokens failed: ${response.status}`)
  }

  const data = (await response.json()) as { input_tokens?: number }
  const normalized = {
    vendor: 'anthropic',
    model,
    tokenCount: data.input_tokens ?? 0,
    raw: data,
  }
  setCached(cacheKey, normalized)
  return normalized
}
