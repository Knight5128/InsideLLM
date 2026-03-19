import { countAnthropicTokens } from '../services/anthropic'
import { countGeminiTokens } from '../services/gemini'
import { json, readBody } from '../utils/json'
import type { Env, TokenCountRequest } from '../utils/schema'

export async function handleTokenCount(request: Request, env: Env) {
  const body = await readBody<TokenCountRequest>(request)

  if (!body.text || !body.model || !body.vendor) {
    return json({ error: 'vendor, model, and text are required.' }, { status: 400 })
  }

  if (body.vendor === 'google') {
    if (!env.GEMINI_API_KEY) {
      return json({ error: 'Missing GEMINI_API_KEY.' }, { status: 500 })
    }

    return json(await countGeminiTokens(env.GEMINI_API_KEY, body.model, body.text))
  }

  if (body.vendor === 'anthropic') {
    if (!env.ANTHROPIC_API_KEY) {
      return json({ error: 'Missing ANTHROPIC_API_KEY.' }, { status: 500 })
    }

    return json(await countAnthropicTokens(env.ANTHROPIC_API_KEY, body.model, body.text))
  }

  return json({ error: 'Unsupported vendor for token count.' }, { status: 400 })
}
