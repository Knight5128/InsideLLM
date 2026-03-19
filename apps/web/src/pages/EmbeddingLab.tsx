import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { EmbeddingSpaceExplorer } from '@/components/labs/EmbeddingSpaceExplorer'

export function EmbeddingLabPage() {
  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <Badge>Embedding 训练实验</Badge>
        <h1 className="text-4xl font-semibold text-white">看见语义空间如何被训练出来</h1>
        <p className="max-w-4xl text-sm leading-7 text-slate-300">
          这一页用教学抽象解释 embedding 是如何逐步学会“让相似文本更近，让不相似文本更远”的。
          重点是帮助用户获得直觉，而不是声称复刻了某家厂商完整公开的真实训练流水线。
        </p>
      </Card>

      <EmbeddingSpaceExplorer />
    </div>
  )
}
