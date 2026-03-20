import { useMemo } from 'react'

import sampleTexts from '@/content/samples/token-samples.json'
import { Card } from '@/components/ui/card'

const tokenizerOptions = [
  { id: 'Xenova/gpt-4', label: 'gpt-4 / gpt-3.5-turbo / text-embedding-ada-002' },
  { id: 'Xenova/text-davinci-003', label: 'text-davinci-003 / text-davinci-002' },
  { id: 'Xenova/gpt-3', label: 'gpt-3' },
  { id: 'Xenova/grok-1-tokenizer', label: 'Grok-1' },
  { id: 'Xenova/claude-tokenizer', label: 'Claude' },
  { id: 'Xenova/mistral-tokenizer-v3', label: 'Mistral v3' },
  { id: 'Xenova/mistral-tokenizer-v1', label: 'Mistral v1' },
  { id: 'Xenova/gemma-tokenizer', label: 'Gemma' },
  { id: 'Xenova/llama-3-tokenizer', label: 'Llama 3' },
  { id: 'Xenova/llama-tokenizer', label: 'LLaMA / Llama 2' },
  { id: 'Xenova/c4ai-command-r-v01-tokenizer', label: 'Cohere Command-R' },
  { id: 'Xenova/t5-small', label: 'T5' },
  { id: 'Xenova/bert-base-cased', label: 'bert-base-cased' },
  { id: '', label: 'Custom' },
] as const

interface TokenizerPlaygroundEmbedProps {
  text: string
  tokenizerId: string
  onTextChange: (value: string) => void
  onTokenizerChange: (value: string) => void
}

export function TokenizerPlaygroundEmbed({
  text,
  tokenizerId,
  onTextChange,
  onTokenizerChange,
}: TokenizerPlaygroundEmbedProps) {
  const iframeSrc = useMemo(() => {
    const params = new URLSearchParams({
      tokenizer: tokenizerId,
      text,
    })

    return `/tokenizer-playground/index.html?${params.toString()}`
  }, [text, tokenizerId])

  return (
    <section className="space-y-6">
      <Card className="space-y-5">

        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <label className="grid gap-2 text-sm text-slate-600">
            测试文本
            <textarea
              className="min-h-40 w-full rounded-3xl border border-cyan-100 bg-white px-4 py-4 text-base text-slate-900 outline-none transition focus:border-cyan-300"
              onChange={(event) => onTextChange(event.target.value)}
              value={text}
            />
          </label>

          <div className="space-y-4">
            <label className="grid gap-2 text-sm text-slate-600">
              选择 tokenizer
              <select
                className="rounded-2xl border border-cyan-100 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-300"
                onChange={(event) => onTokenizerChange(event.target.value)}
                value={tokenizerId}
              >
                {tokenizerOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <a
              className="inline-flex rounded-full border border-cyan-100 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-cyan-50"
              href={iframeSrc}
              rel="noreferrer"
              target="_blank"
            >
              在独立页面打开实验场
            </a>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {sampleTexts.map((sample) => (
            <button
              key={sample.id}
              className="rounded-full border border-cyan-100 bg-white/85 px-3 py-2 text-sm text-slate-700 transition hover:bg-cyan-50"
              onClick={() => onTextChange(sample.text)}
              type="button"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        <iframe
          className="h-[980px] w-full border-0 bg-white"
          key={iframeSrc}
          loading="lazy"
          src={iframeSrc}
          title="Tokenizer Playground"
        />
      </Card>
    </section>
  )
}
