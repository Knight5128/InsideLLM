import { useMemo } from 'react'

import sampleTexts from '@/content/samples/token-samples.json'
import { Card } from '@/components/ui/card'

const tokenizerOptions = [
  { id: 'Xenova/gpt-4', label: 'OpenAI GPT-4 / GPT-3.5' },
  { id: 'Xenova/claude-tokenizer', label: 'Anthropic Claude' },
  { id: 'Xenova/grok-1-tokenizer', label: 'xAI Grok-1' },
  { id: 'Xenova/mistral-tokenizer-v3', label: 'Mistral v3' },
  { id: 'Xenova/gemma-tokenizer', label: 'Gemma' },
  { id: 'Xenova/llama-3-tokenizer', label: 'Llama 3' },
  { id: 'Xenova/c4ai-command-r-v01-tokenizer', label: 'Cohere Command-R' },
  { id: 'Xenova/t5-small', label: 'T5' },
  { id: 'Xenova/bert-base-cased', label: 'BERT' },
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
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-slate-900">Hugging Face Tokenizer Playground</h2>
          <p className="max-w-3xl text-sm leading-6 text-slate-600">
            Token 实验室现在直接嵌入 Xenova 的 tokenizer playground 实现，用同一个输入快速切换不同模型的 tokenizer。
          </p>
        </div>

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

            <div className="rounded-3xl border border-cyan-100 bg-cyan-50/60 p-4 text-sm leading-6 text-slate-600">
              嵌入页会根据上面的文本和 tokenizer 重新加载，你也可以直接在实验场内部继续交互。
            </div>

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
