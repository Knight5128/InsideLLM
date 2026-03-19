import type { ExperienceMode, VendorId } from './schemas'

export const DEFAULT_VENDOR: VendorId = 'openai'
export const DEFAULT_MODE: ExperienceMode = 'guide'

export const EXPERIENCE_MODE_LABELS: Record<ExperienceMode, string> = {
  guide: '导览模式',
  explore: '自由探索',
  experiment: '实验模式',
}

export const TOKENIZER_ENCODINGS = [
  {
    id: 'cl100k_base',
    vendor: 'openai',
    label: 'cl100k_base',
    era: 'GPT-4 / GPT-3.5 时代常见编码',
  },
  {
    id: 'o200k_base',
    vendor: 'openai',
    label: 'o200k_base',
    era: 'GPT-4o / o1 / o3 时代更高效编码',
  },
] as const

export const PRIMARY_VENDORS: VendorId[] = ['openai', 'google', 'anthropic']
