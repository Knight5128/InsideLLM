import { ModelEvolutionTimeline } from '@/components/timeline/ModelEvolutionTimeline'
import { Card } from '@/components/ui/card'

export function TimelinePage() {
  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold text-slate-900">Tokenizer 时间轴</h1>
          <p className="max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
            这里聚焦 tokenizer 本身的演化，不再混排 embedding 路线。你可以按厂商、按
            tokenizer 类型筛选，并切换时间轴的正序或逆序查看方式。
          </p>
        </div>
      </Card>
      <ModelEvolutionTimeline />
    </div>
  )
}
