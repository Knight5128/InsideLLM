import { corsPreflight, json } from './utils/json'

export default {
  async fetch(request: Request) {
    const url = new URL(request.url)

    try {
      if (request.method === 'OPTIONS') {
        return corsPreflight()
      }

      if (request.method === 'GET' && url.pathname === '/') {
        return json({
          app: 'InsideLLM Worker',
          ok: true,
          deprecated: true,
          message: 'Token Lab now uses an embedded local tokenizer playground. No API endpoints are required.',
        })
      }

      return json({ error: 'Not found.' }, { status: 404 })
    } catch (error) {
      return json(
        {
          error: 'Worker request failed.',
          detail: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 },
      )
    }
  },
}
