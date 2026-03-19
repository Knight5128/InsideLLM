import type { VendorMeta } from './schemas'

const verifiedAt = '2026-03-19'

export const vendorMetadata: VendorMeta[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    theme: '#7c3aed',
    summary: '更容易展示新旧 tokenizer 在同一段文本上的切分差异。',
    detail:
      '适合对比 cl100k_base 与 o200k_base，帮助用户直观看到中文文本的 token 化效率如何改变。',
    tokenizerStory:
      '公开资料显示不同 encoding 会改变非英文文本的 token 计数体感，适合做并排实验。',
    embeddingStory:
      '公开 embedding 线路清晰，可从 text-embedding-ada-002 过渡到 text-embedding-3-small / large。',
    confidence: {
      sourceType: 'official',
      confidenceLevel: 'high',
      notes: '基于公开 API、Cookbook 和模型文档整理。',
      lastVerifiedAt: verifiedAt,
    },
  },
  {
    id: 'google',
    name: 'Google Gemini',
    theme: '#0ea5e9',
    summary: '官方提供 token counting 与 token listing，适合做实时交互实验。',
    detail:
      'Gemini 既适合展示 token 边界，也适合串联到独立的 embedding 主题中。',
    tokenizerStory:
      '文档强调 tokenizer 会影响 token 边界与计数，因此非常适合作为实验型演示对象。',
    embeddingStory:
      'Gemini Embedding / Gemini Embedding 2 Preview 体现了 Google 在向量能力上的独立产品线。',
    confidence: {
      sourceType: 'official',
      confidenceLevel: 'high',
      notes: '基于 Gemini API 与 Vertex AI 文档整理。',
      lastVerifiedAt: verifiedAt,
    },
  },
  {
    id: 'anthropic',
    name: 'Anthropic Claude',
    theme: '#f97316',
    summary: '重点应放在 token 计数和生态方案，而不是声称存在 Claude 自有 embedding 代际。',
    detail:
      'Anthropic 的教学价值在于让用户理解：模型厂商和 embedding 提供方不一定是同一角色。',
    tokenizerStory:
      '可通过 token counting 解释 Claude 系列如何处理上下文与成本估算。',
    embeddingStory:
      '更适合作为“Anthropic 生态中的 embedding 方案”展示，并说明常见第三方如 Voyage AI。',
    confidence: {
      sourceType: 'official',
      confidenceLevel: 'high',
      notes: '基于 Anthropic 文档中 token counting 与 embedding 生态说明整理。',
      lastVerifiedAt: verifiedAt,
    },
  },
]
