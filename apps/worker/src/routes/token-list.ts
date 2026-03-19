import { listGeminiTokens } from '../services/gemini'
import { json, readBody } from '../utils/json'
import type { Env, TokenListRequest } from '../utils/schema'

export async function handleTokenList(request: Request, env: Env) {
  const body = await readBody<TokenListRequest>(request)

  if (!body.text || !body.model || !body.vendor) {
    return json({ error: 'vendor, model, and text are required.' }, { status: 400 })
  }

  if (body.vendor !== 'google') {
    return json({ error: 'Only Gemini token listing is supported.' }, { status: 400 })
  }

  if (!env.GEMINI_API_KEY) {
    return json({ error: 'Missing GEMINI_API_KEY.' }, { status: 500 })
  }

  return json(await listGeminiTokens(env.GEMINI_API_KEY, body.model, body.text))
}
