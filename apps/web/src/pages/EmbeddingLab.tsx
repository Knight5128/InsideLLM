import { Card } from '@/components/ui/card'
import { VendorSelect } from '@/components/layout/VendorSelect'
import { EmbeddingSpaceExplorer } from '@/components/labs/EmbeddingSpaceExplorer'

export function EmbeddingLabPage() {
  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <h1 className="text-4xl font-semibold text-slate-900">看见语义空间如何被训练出来</h1>
          <VendorSelect />
        </div>
      </Card>

      <EmbeddingSpaceExplorer />
    </div>
  )
}
