import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import type { TokenBreakdown } from '@insidellm/shared'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { tokenizeText } from '@/lib/tokenizer/tokenize'

const gridPositions = [
  { x: 14, y: 35 },
  { x: 28, y: 62 },
  { x: 40, y: 22 },
  { x: 57, y: 55 },
  { x: 74, y: 34 },
  { x: 84, y: 60 },
]

export function VectorChainPanel({ text }: { text: string }) {
  const [breakdown, setBreakdown] = useState<TokenBreakdown | null>(null)

  useEffect(() => {
    let active = true

    tokenizeText(text, 'o200k_base').then((result) => {
      if (active) {
        setBreakdown(result)
      }
    })

    return () => {
      active = false
    }
  }, [text])

  const visibleChunks = breakdown?.chunks.slice(0, 6) ?? []

  return (
    <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <Card className="space-y-4">
        <Badge>token {'->'} 向量</Badge>
        <h2 className="text-2xl font-semibold text-white">从查表到上下文化</h2>
        <p className="text-sm leading-6 text-slate-300">
          同一个 token 先从词表中拿到初始向量，然后在 Transformer 中根据上下文产生漂移。
        </p>
        <div className="space-y-3">
          {visibleChunks.map((chunk, index) => (
            <div key={chunk.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm text-slate-400">token #{chunk.tokenId}</div>
                  <div className="text-lg font-semibold text-white">
                    {chunk.text.replaceAll(' ', '␠').replaceAll('\n', '↵')}
                  </div>
                </div>
                <div className="text-xs text-slate-400">lookup {'->'} contextualize</div>
              </div>
              <div className="mt-3 flex items-center gap-3 text-xs text-slate-300">
                <span className="rounded-full bg-slate-800 px-3 py-1">初始向量 #{index + 1}</span>
                <span>→</span>
                <span className="rounded-full bg-violet-500/20 px-3 py-1">受上下文影响后发生漂移</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm text-slate-400">2D 教学投影</div>
            <h3 className="text-xl font-semibold text-white">初始向量与上下文化后的语义位置</h3>
          </div>
          <Badge>教学抽象</Badge>
        </div>

        <svg className="h-[26rem] w-full rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.2),_transparent_35%),#020617]" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="vector-flow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>
          </defs>
          {visibleChunks.map((chunk, index) => {
            const start = gridPositions[index] ?? { x: 15 + index * 10, y: 20 + index * 8 }
            const end = {
              x: start.x + 6 + (index % 2 === 0 ? 9 : -4),
              y: start.y + (index % 2 === 0 ? -11 : 9),
            }

            return (
              <g key={chunk.id}>
                <circle cx={start.x} cy={start.y} fill="#1e293b" r="2.6" stroke="#94a3b8" />
                <motion.circle
                  animate={{ cx: end.x, cy: end.y }}
                  cx={start.x}
                  cy={start.y}
                  fill="#c084fc"
                  r="2.8"
                  transition={{ duration: 1.6, repeat: Number.POSITIVE_INFINITY, repeatType: 'reverse', delay: index * 0.08 }}
                />
                <line
                  stroke="url(#vector-flow)"
                  strokeDasharray="2 2"
                  strokeOpacity="0.8"
                  x1={start.x}
                  x2={end.x}
                  y1={start.y}
                  y2={end.y}
                />
                <text fill="#e2e8f0" fontSize="3" x={end.x + 1.8} y={end.y - 1}>
                  {chunk.text.trim() || 'space'}
                </text>
              </g>
            )
          })}
        </svg>
      </Card>
    </section>
  )
}
