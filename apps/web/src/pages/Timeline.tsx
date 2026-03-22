import { ModelEvolutionTimeline } from '@/components/timeline/ModelEvolutionTimeline'
import { Card } from '@/components/ui/card'

export function TimelinePage() {
  return (
    <div className="space-y-6">
      {/*
      <Card className="space-y-4">
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold text-slate-900">Tokenizer 时间轴</h1>
          <p className="max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
            聚焦各家主大模型厂商已公开披露的 tokenizer 本身的演化路径。
          </p>
        </div>
      </Card>
      */}
      <ModelEvolutionTimeline />
    </div>
  )
}
