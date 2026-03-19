import { Suspense, lazy } from 'react'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { usePerformanceMode } from '@/hooks/usePerformanceMode'
import { useAppStore } from '@/stores/useAppStore'

const TransformerScene = lazy(() =>
  import('@/components/3d/TransformerScene').then((module) => ({ default: module.TransformerScene })),
)

export function ArchitecturePage() {
  const detailMode = useAppStore((state) => state.detailMode)
  const setDetailMode = useAppStore((state) => state.setDetailMode)
  const { prefersLiteScene } = usePerformanceMode()

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <Badge>3D Transformer 展厅</Badge>
        <h1 className="text-4xl font-semibold text-white">建立模型内部的大致空间认知</h1>
        <p className="max-w-4xl text-sm leading-7 text-slate-300">
          这个场景不是复刻某一家闭源模型的真实参数布局，而是用教学化方式把 tokenizer、embedding、
          Transformer blocks 和 output head 的关系讲清楚。
        </p>
        <div className="flex gap-2">
          <button
            className={`rounded-full px-4 py-2 text-sm ${
              detailMode === 'basic' ? 'bg-violet-500 text-white' : 'bg-white/5 text-slate-300'
            }`}
            onClick={() => setDetailMode('basic')}
            type="button"
          >
            初级视图
          </button>
          <button
            className={`rounded-full px-4 py-2 text-sm ${
              detailMode === 'advanced' ? 'bg-violet-500 text-white' : 'bg-white/5 text-slate-300'
            }`}
            onClick={() => setDetailMode('advanced')}
            type="button"
          >
            高级视图
          </button>
        </div>
      </Card>

      {prefersLiteScene ? (
        <Card className="grid gap-3">
          <Badge>2D 降级视图</Badge>
          {[
            'Input Text',
            'Tokenizer',
            'Token IDs',
            'Token Embedding',
            'Positional Information',
            detailMode === 'basic' ? 'Transformer Blocks' : 'Attention + MLP + Residual + LayerNorm',
            'Output Head',
          ].map((label) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
            >
              {label}
            </div>
          ))}
        </Card>
      ) : (
        <Suspense
          fallback={<div className="h-[30rem] rounded-[2rem] border border-white/10 bg-slate-950/60" />}
        >
          <TransformerScene detailMode={detailMode} />
        </Suspense>
      )}

      <section className="grid gap-4 lg:grid-cols-4">
        {[
          ['Tokenizer', '把文本切块，并决定后续 token 数与输入成本感受。'],
          ['Embedding', '把离散 token id 映射成连续向量，是文字进入数学空间的第一步。'],
          ['Attention', '帮助每个 token 参考上下文，理解“现在该关注谁”。'],
          ['MLP + Residual', '在保持稳定训练的同时，让表示不断被非线性更新。'],
        ].map(([title, body]) => (
          <Card key={title} className="space-y-2">
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <p className="text-sm leading-6 text-slate-300">{body}</p>
          </Card>
        ))}
      </section>
    </div>
  )
}
