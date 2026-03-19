import { handleTokenCount } from './routes/token-count'
import { handleTokenList } from './routes/token-list'
import { handleVendorMeta } from './routes/vendor-meta'
import { json } from './utils/json'
import type { Env } from './utils/schema'

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url)

    try {
      if (request.method === 'GET' && url.pathname === '/') {
        return json({
          app: env.APP_NAME,
          ok: true,
          routes: ['/api/token-count', '/api/token-list', '/api/vendor-meta'],
        })
      }

      if (request.method === 'GET' && url.pathname === '/api/vendor-meta') {
        return handleVendorMeta()
      }

      if (request.method === 'POST' && url.pathname === '/api/token-count') {
        return await handleTokenCount(request, env)
      }

      if (request.method === 'POST' && url.pathname === '/api/token-list') {
        return await handleTokenList(request, env)
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
