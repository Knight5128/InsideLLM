import { ModelEvolutionTimeline } from '@/components/timeline/ModelEvolutionTimeline'
import { VendorSelect } from '@/components/layout/VendorSelect'
import { Card } from '@/components/ui/card'

export function TimelinePage() {
  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <h1 className="text-4xl font-semibold text-slate-900">从 tokenizer 到 embedding 的代际变化</h1>
          <VendorSelect />
        </div>
      </Card>
      <ModelEvolutionTimeline />
    </div>
  )
}
