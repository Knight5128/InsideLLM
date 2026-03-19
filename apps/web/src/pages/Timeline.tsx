import { ModelEvolutionTimeline } from '@/components/timeline/ModelEvolutionTimeline'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

export function TimelinePage() {
  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <Badge>厂商演化时间轴</Badge>
        <h1 className="text-4xl font-semibold text-white">从 tokenizer 到 embedding 的代际变化</h1>
        <p className="max-w-4xl text-sm leading-7 text-slate-300">
          这里强调的是“变化被如何感知到”。用户不需要背每个版本号，只需要理解为什么同一句中文在不同代际会有不同的
          token 体验，以及 embedding 产品线如何逐步独立出来。
        </p>
      </Card>
      <ModelEvolutionTimeline />
    </div>
  )
}
