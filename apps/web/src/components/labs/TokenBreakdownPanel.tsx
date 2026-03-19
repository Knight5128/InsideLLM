import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import type { TokenBreakdown } from '@insidellm/shared'

import sampleTexts from '@/content/samples/token-samples.json'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatRatio } from '@/lib/utils'
import { tokenizeText } from '@/lib/tokenizer/tokenize'

function TokenChips({ encoding, text }: { encoding: 'cl100k_base' | 'o200k_base'; text: string }) {
  const [breakdown, setBreakdown] = useState<TokenBreakdown | null>(null)

  useEffect(() => {
    let active = true

    tokenizeText(text, encoding).then((result) => {
      if (active) {
        setBreakdown(result)
      }
    })

    return () => {
      active = false
    }
  }, [encoding, text])

  if (!breakdown) {
    return (
      <Card className="space-y-4">
        <div className="text-lg font-semibold text-slate-900">{encoding}</div>
        <div className="rounded-2xl border border-cyan-100 bg-cyan-50/60 p-4 text-sm text-slate-600">
          正在加载 tokenizer...
        </div>
      </Card>
    )
  }

  return (
    <Card className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-lg font-semibold text-slate-900">{encoding}</div>
          <div className="text-sm text-slate-500">
            字符 {breakdown.charCount} / token {breakdown.tokenCount} / 比值{' '}
            {formatRatio(breakdown.charTokenRatio)}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-cyan-100 bg-cyan-50/70 p-4 text-sm text-slate-700">
        {breakdown.chunks.map((chunk) => (
          <button
            key={chunk.id}
            className="mb-2 mr-2 rounded-2xl border border-cyan-100 bg-white/90 px-3 py-2 text-left transition hover:border-cyan-300 hover:bg-cyan-50"
            title={`tokenId=${chunk.tokenId}, bytes=${chunk.bytes.join(',')}`}
            type="button"
          >
            <span className="block font-medium text-slate-900">
              {chunk.text.replaceAll(' ', '␠').replaceAll('\n', '↵')}
            </span>
            <span className="text-xs text-slate-500">#{chunk.tokenId}</span>
          </button>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-cyan-100 bg-white/85 p-3">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-500">token 数</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">{breakdown.tokenCount}</div>
        </div>
        <div className="rounded-2xl border border-cyan-100 bg-white/85 p-3">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-500">字符数</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">{breakdown.charCount}</div>
        </div>
        <div className="rounded-2xl border border-cyan-100 bg-white/85 p-3">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-500">字符 / token</div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">
            {formatRatio(breakdown.charTokenRatio)}
          </div>
        </div>
      </div>
    </Card>
  )
}

interface TokenBreakdownPanelProps {
  text?: string
  onTextChange?: (value: string) => void
}

export function TokenBreakdownPanel({
  text: controlledText,
  onTextChange,
}: TokenBreakdownPanelProps) {
  const [internalText, setInternalText] = useState(sampleTexts[0].text)
  const text = controlledText ?? internalText
  const setText = onTextChange ?? setInternalText

  return (
    <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <Card className="space-y-5">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-slate-900">文本拆分</h2>
        </div>

        <textarea
          className="min-h-40 w-full rounded-3xl border border-cyan-100 bg-white px-4 py-4 text-base text-slate-900 outline-none transition focus:border-cyan-300"
          onChange={(event) => setText(event.target.value)}
          value={text}
        />

        <div className="flex flex-wrap gap-2">
          {sampleTexts.map((sample) => (
            <button
              key={sample.id}
              className="rounded-full border border-cyan-100 bg-white/85 px-3 py-2 text-sm text-slate-700 transition hover:bg-cyan-50"
              onClick={() => setText(sample.text)}
              type="button"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </Card>

      <Tabs className="space-y-4" defaultValue="compare">
        <TabsList>
          <TabsTrigger value="compare">双编码对比</TabsTrigger>
          <TabsTrigger value="logic">可视化逻辑</TabsTrigger>
        </TabsList>

        <TabsContent value="compare">
          <div className="grid gap-4">
            <TokenChips encoding="cl100k_base" text={text} />
            <TokenChips encoding="o200k_base" text={text} />
          </div>
        </TabsContent>

        <TabsContent value="logic">
          <Card className="space-y-4">
            {[
              ['1', '字符层', '人类先看到的是连续文本。'],
              ['2', 'token 层', 'Tokenizer 按词表和规则切成模型能读取的块。'],
              ['3', 'token id 层', '每个 token 被映射成离散整数，进入词表查找。'],
              ['4', 'embedding 层', '离散整数再查表得到连续向量。'],
            ].map(([index, title, body], order) => (
              <motion.div
                key={title}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-cyan-100 bg-cyan-50/60 p-4"
                initial={{ opacity: 0, y: 20 }}
                transition={{ delay: order * 0.08 }}
              >
                <div className="text-xs uppercase tracking-[0.2em] text-cyan-700">Step {index}</div>
                <div className="mt-2 text-lg font-semibold text-slate-900">{title}</div>
                <p className="mt-2 text-sm text-slate-600">{body}</p>
              </motion.div>
            ))}
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  )
}
