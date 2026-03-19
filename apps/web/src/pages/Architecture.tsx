import { Suspense, lazy } from 'react'
import { Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { usePerformanceMode } from '@/hooks/usePerformanceMode'
import { useAppStore } from '@/stores/useAppStore'

const TransformerScene = lazy(() =>
  import('@/components/3d/TransformerScene').then((module) => ({ default: module.TransformerScene })),
)

export function ArchitecturePage() {
  const detailMode = useAppStore((state) => state.detailMode)
  const setDetailMode = useAppStore((state) => state.setDetailMode)
  const motionReduced = useAppStore((state) => state.motionReduced)
  const toggleReducedMotion = useAppStore((state) => state.toggleReducedMotion)
  const { prefersLiteScene } = usePerformanceMode()

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <h1 className="text-4xl font-semibold text-slate-900">OpenAI 模型内部结构</h1>
          <Button onClick={toggleReducedMotion} type="button" variant="secondary">
            <Sparkles className="mr-2 h-4 w-4" />
            {motionReduced ? '开启动效' : '关闭动效'}
          </Button>
        </div>
        <div className="flex gap-2">
          <button
            className={`rounded-full px-4 py-2 text-sm ${
              detailMode === 'basic' ? 'bg-cyan-300 text-slate-900' : 'bg-white/80 text-slate-600'
            }`}
            onClick={() => setDetailMode('basic')}
            type="button"
          >
            初级视图
          </button>
          <button
            className={`rounded-full px-4 py-2 text-sm ${
              detailMode === 'advanced' ? 'bg-cyan-300 text-slate-900' : 'bg-white/80 text-slate-600'
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
              className="rounded-2xl border border-cyan-100 bg-cyan-50/55 px-4 py-3 text-sm text-slate-700"
            >
              {label}
            </div>
          ))}
        </Card>
      ) : (
        <Suspense
          fallback={<div className="h-[30rem] rounded-[2rem] border border-cyan-100 bg-white/80" />}
        >
          <TransformerScene detailMode={detailMode} />
        </Suspense>
      )}
    </div>
  )
}
