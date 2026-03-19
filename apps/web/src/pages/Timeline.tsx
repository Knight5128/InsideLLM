import { ModelEvolutionTimeline } from '@/components/timeline/ModelEvolutionTimeline'
import { Card } from '@/components/ui/card'

export function TimelinePage() {
  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <h1 className="text-4xl font-semibold text-slate-900">从 tokenizer 到 embedding 的代际变化</h1>
      </Card>
      <ModelEvolutionTimeline />
    </div>
  )
}
