import { motion } from 'framer-motion'

import { guidedSteps } from '@/lib/animation/tour'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

export function GuidedTourController() {
  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <Badge>导览模式</Badge>
          <h2 className="mt-2 text-2xl font-semibold text-white">5 步建立完整直觉</h2>
        </div>
        <Badge>自动镜头 + 旁白节奏</Badge>
      </div>
      <div className="grid gap-3 md:grid-cols-5">
        {guidedSteps.map((step, index) => (
          <motion.div
            key={step.id}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-4"
            initial={{ opacity: 0, y: 18 }}
            transition={{ delay: index * 0.08 }}
          >
            <div className="text-xs uppercase tracking-[0.2em] text-violet-200">Step {index + 1}</div>
            <div className="mt-2 font-semibold text-white">{step.title}</div>
            <p className="mt-2 text-sm text-slate-300">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </Card>
  )
}
