import { vendorMetadata } from '@insidellm/shared'

import { getOpenAiTokenizerMeta } from '../services/openai'
import { json } from '../utils/json'

export function handleVendorMeta() {
  return json({
    vendors: vendorMetadata,
    openai: getOpenAiTokenizerMeta(),
    endpoints: {
      tokenCount: '/api/token-count',
      tokenList: '/api/token-list',
      vendorMeta: '/api/vendor-meta',
    },
  })
}
