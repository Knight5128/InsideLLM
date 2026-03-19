import type { TimelineEvent } from '@insidellm/shared'

import anthropicTimeline from '@/content/timeline/anthropic.json'
import googleTimeline from '@/content/timeline/google.json'
import openaiTimeline from '@/content/timeline/openai.json'
import vendors from '@/content/vendors/vendors.json'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { useAppStore } from '@/stores/useAppStore'

const events = [
  ...(openaiTimeline as TimelineEvent[]),
  ...(googleTimeline as TimelineEvent[]),
  ...(anthropicTimeline as TimelineEvent[]),
].sort((a, b) => a.date.localeCompare(b.date))

const laneLabel = {
  tokenizer: 'Tokenizer / Token Handling',
  embedding: 'Embedding 路线',
  capability: '整体能力',
}

export function ModelEvolutionTimeline() {
  const vendor = useAppStore((state) => state.vendor)
  const visibleEvents = events.filter((event) => event.vendor === vendor)
  const vendorInfo = vendors.find((item) => item.id === vendor)

  return (
    <section className="space-y-6">
      <Card className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Badge>模型演化时间轴</Badge>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">
              {vendorInfo?.name ?? vendor} 的 tokenizer / embedding 演化脉络
            </h2>
          </div>
          <Badge>{vendorInfo?.summary}</Badge>
        </div>
        <p className="max-w-3xl text-sm leading-6 text-slate-600">{vendorInfo?.detail}</p>
      </Card>

      <div className="relative space-y-4 before:absolute before:left-5 before:top-4 before:h-[calc(100%-2rem)] before:w-px before:bg-cyan-200">
        {visibleEvents.map((event) => (
          <Card key={event.id} className="relative ml-6 space-y-3">
            <div className="absolute -left-8 top-8 h-4 w-4 rounded-full border-4 border-white bg-cyan-300" />
            <div className="flex flex-wrap items-center gap-2">
              <Badge>{event.date}</Badge>
              <Badge>{laneLabel[event.lane]}</Badge>
              <Badge>{event.confidence.sourceType}</Badge>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900">{event.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{event.summary}</p>
            </div>
            <div className="rounded-2xl border border-cyan-100 bg-cyan-50/55 p-4 text-sm text-slate-600">
              <span className="font-medium text-slate-900">相较上一阶段：</span> {event.changeFromPrevious}
            </div>
            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-cyan-100 bg-white px-3 py-1 text-xs text-slate-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
