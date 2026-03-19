export type VendorId = 'openai' | 'google' | 'anthropic'

export type ConfidenceLevel = 'high' | 'medium' | 'teaching'
export type SourceType = 'official' | 'measured' | 'educational'

export type ExperienceMode = 'guide' | 'explore' | 'experiment'
export type DetailMode = 'basic' | 'advanced'

export interface ConfidenceMeta {
  sourceType: SourceType
  confidenceLevel: ConfidenceLevel
  notes: string
  lastVerifiedAt: string
}

export interface TokenChunk {
  id: string
  text: string
  tokenId: number
  start: number
  end: number
  bytes: number[]
}

export interface TokenBreakdown {
  encoding: string
  vendor: VendorId
  text: string
  charCount: number
  tokenCount: number
  charTokenRatio: number
  chunks: TokenChunk[]
}

export interface ProjectionPoint {
  id: string
  label: string
  group: string
  x: number
  y: number
  z?: number
  phase?: 'before' | 'during' | 'after'
}

export interface TimelineEvent {
  id: string
  vendor: VendorId
  lane: 'tokenizer' | 'embedding' | 'capability'
  title: string
  date: string
  summary: string
  changeFromPrevious: string
  tags: string[]
  confidence: ConfidenceMeta
}

export interface VendorMeta {
  id: VendorId
  name: string
  theme: string
  summary: string
  detail: string
  tokenizerStory: string
  embeddingStory: string
  confidence: ConfidenceMeta
}

export interface GlossaryTerm {
  id: string
  term: string
  simple: string
  advanced: string
}
