import { useMemo, useState } from 'react'
import type { ProjectionPoint } from '@insidellm/shared'

import rawPoints from '@/content/samples/projection-points.json'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { normalizeProjection } from '@/lib/projection/embeddingProjection'
import { groupBy } from '@/lib/utils'

type Phase = 'before' | 'during' | 'after'

const phaseLabels: Record<Phase, string> = {
  before: '训练前',
  during: '训练中',
  after: '训练后',
}

export function EmbeddingSpaceExplorer() {
  const [phase, setPhase] = useState<Phase>('during')

  const points = useMemo(() => normalizeProjection(rawPoints as ProjectionPoint[]), [])
  const byPhase = useMemo(() => groupBy(points, (point) => point.phase ?? 'before'), [points])
  const visible = (byPhase[phase] ?? []) as Array<ProjectionPoint & { cx: number; cy: number }>

  return (
    <section className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
      <Card className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <Badge>Embedding 训练过程</Badge>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900">语义磁场如何慢慢形成</h2>
          </div>
          <Badge>教学抽象</Badge>
        </div>

        <div className="space-y-3">
          {[
            ['采样 batch', '从语料中抽取一小批文本或 token 对。'],
            ['前向传播', '模型先根据当前参数计算向量表示和预测结果。'],
            ['计算 loss', '看哪些相似样本应该更近，哪些不相关样本应该更远。'],
            ['反向更新', '把误差传回去，微调 embedding 与网络参数。'],
            ['评估收敛', '随着轮数增加，主题簇会逐渐稳定。'],
          ].map(([title, body], index) => (
            <div
              key={title}
              className={`rounded-2xl border p-4 ${
                index === 2 ? 'border-cyan-300 bg-cyan-50' : 'border-cyan-100 bg-cyan-50/55'
              }`}
            >
              <div className="text-sm font-semibold text-slate-900">{title}</div>
              <p className="mt-2 text-sm text-slate-600">{body}</p>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
          这里展示的是通用 embedding 学习逻辑示意，不代表任何一家厂商完整公开的真实内部训练流水线。
        </div>
      </Card>

      <Card className="space-y-4">
        <Tabs defaultValue="basic">
          <TabsList>
            <TabsTrigger value="basic">基础模式</TabsTrigger>
            <TabsTrigger value="advanced">进阶模式</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {(Object.keys(phaseLabels) as Phase[]).map((item) => (
                <button
                  key={item}
                  className={`rounded-full px-4 py-2 text-sm ${
                    item === phase ? 'bg-cyan-300 text-slate-900' : 'bg-white/80 text-slate-600'
                  }`}
                  onClick={() => setPhase(item)}
                  type="button"
                >
                  {phaseLabels[item]}
                </button>
              ))}
            </div>

            <svg
              className="h-[28rem] w-full rounded-3xl border border-cyan-100 bg-[radial-gradient(circle_at_top,_rgba(165,243,252,0.55),_transparent_30%),linear-gradient(180deg,_#ffffff_0%,_#ecfeff_100%)]"
              viewBox="0 0 100 100"
            >
              <text fill="#64748b" fontSize="4" x="4" y="8">
                {phaseLabels[phase]}: 语义点云
              </text>
              {visible.map((point) => (
                <g key={point.id}>
                  <circle
                    cx={point.cx}
                    cy={point.cy}
                    fill={point.group === '动物' ? '#22d3ee' : '#2dd4bf'}
                    r="3.5"
                  />
                  <text fill="#155e75" fontSize="3" x={point.cx + 2.6} y={point.cy - 1}>
                    {point.label}
                  </text>
                </g>
              ))}
            </svg>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-cyan-100 bg-cyan-50/55 p-4">
                <div className="text-sm font-semibold text-slate-900">Batch</div>
                <p className="mt-2 text-sm text-slate-600">
                  同一批次里既有正样本，也有负样本，帮助模型学习哪些点应该靠近。
                </p>
              </div>
              <div className="rounded-2xl border border-cyan-100 bg-cyan-50/55 p-4">
                <div className="text-sm font-semibold text-slate-900">Loss</div>
                <p className="mt-2 text-sm text-slate-600">
                  loss 越低，说明语义空间中的相对位置越符合训练目标。
                </p>
              </div>
              <div className="rounded-2xl border border-cyan-100 bg-cyan-50/55 p-4">
                <div className="text-sm font-semibold text-slate-900">Backward</div>
                <p className="mt-2 text-sm text-slate-600">
                  反向传播把误差信号传回 embedding 层，让向量一点点挪到更合理的位置。
                </p>
              </div>
              <div className="rounded-2xl border border-cyan-100 bg-cyan-50/55 p-4">
                <div className="text-sm font-semibold text-slate-900">Normalization</div>
                <p className="mt-2 text-sm text-slate-600">
                  实际系统中常会加入归一化或投影技巧，保持向量空间稳定易用。
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </section>
  )
}
