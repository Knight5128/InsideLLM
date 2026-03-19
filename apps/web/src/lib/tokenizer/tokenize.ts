import { Tiktoken } from 'js-tiktoken/lite'

import type { TokenBreakdown, TokenChunk } from '@insidellm/shared'

const encoder = new TextEncoder()

export type SupportedEncoding = 'cl100k_base' | 'o200k_base'

const encoderCache = new Map<SupportedEncoding, Tiktoken>()

async function getEncoder(encoding: SupportedEncoding) {
  const cached = encoderCache.get(encoding)
  if (cached) {
    return cached
  }

  const ranks =
    encoding === 'cl100k_base'
      ? (await import('js-tiktoken/ranks/cl100k_base')).default
      : (await import('js-tiktoken/ranks/o200k_base')).default

  const tokenizer = new Tiktoken(ranks)
  encoderCache.set(encoding, tokenizer)
  return tokenizer
}

function decodeToken(tokenizer: Tiktoken, tokenId: number) {
  const text = tokenizer.decode([tokenId])
  return {
    text,
    bytes: Array.from(encoder.encode(text)),
  }
}

export async function tokenizeText(
  text: string,
  encoding: SupportedEncoding,
): Promise<TokenBreakdown> {
  const tokenizer = await getEncoder(encoding)
  const ids = tokenizer.encode(text)
  let cursor = 0

  const chunks = ids.map<TokenChunk>((tokenId, index) => {
      const decoded = decodeToken(tokenizer, tokenId)
      const piece = decoded.text || '\u25a1'
      const start = cursor
      const end = cursor + piece.length
      cursor = end

      return {
        id: `${encoding}-${index}-${tokenId}`,
        text: piece,
        tokenId,
        start,
        end,
        bytes: decoded.bytes,
      }
    })

  return {
    encoding,
    vendor: 'openai',
    text,
    charCount: Array.from(text).length,
    tokenCount: ids.length,
    charTokenRatio: ids.length === 0 ? 0 : Array.from(text).length / ids.length,
    chunks,
  }
}
