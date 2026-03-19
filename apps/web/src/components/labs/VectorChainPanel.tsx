import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import type { TokenBreakdown } from '@insidellm/shared'

import { Card } from '@/components/ui/card'
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
        <h2 className="text-2xl font-semibold text-slate-900">token 到向量</h2>
        <div className="space-y-3">
          {visibleChunks.map((chunk, index) => (
            <div key={chunk.id} className="rounded-2xl border border-cyan-100 bg-cyan-50/55 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm text-slate-500">token #{chunk.tokenId}</div>
                  <div className="text-lg font-semibold text-slate-900">
                    {chunk.text.replaceAll(' ', '␠').replaceAll('\n', '↵')}
                  </div>
                </div>
                <div className="text-xs text-slate-500">lookup {'->'} contextualize</div>
              </div>
              <div className="mt-3 flex items-center gap-3 text-xs text-slate-600">
                <span className="rounded-full bg-cyan-100 px-3 py-1 text-cyan-700">初始向量 #{index + 1}</span>
                <span>→</span>
                <span className="rounded-full bg-teal-100 px-3 py-1 text-teal-700">受上下文影响后发生漂移</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">向量位置变化</h3>
          </div>
        </div>

        <svg className="h-[26rem] w-full rounded-3xl border border-cyan-100 bg-[radial-gradient(circle_at_top,_rgba(165,243,252,0.55),_transparent_35%),linear-gradient(180deg,_#ffffff_0%,_#ecfeff_100%)]" viewBox="0 0 100 100">
          <defs>
            <linearGradient id="vector-flow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#2dd4bf" />
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
                <circle cx={start.x} cy={start.y} fill="#cffafe" r="2.6" stroke="#67e8f9" />
                <motion.circle
                  animate={{ cx: end.x, cy: end.y }}
                  cx={start.x}
                  cy={start.y}
                  fill="#2dd4bf"
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
                <text fill="#155e75" fontSize="3" x={end.x + 1.8} y={end.y - 1}>
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
