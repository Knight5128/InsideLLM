import vendors from '@/content/vendors/vendors.json'
import { EntryCards } from '@/components/layout/EntryCards'
import { GuidedTourController } from '@/components/layout/GuidedTourController'
import { HeroSection } from '@/components/layout/HeroSection'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

export function HomePage() {
  return (
    <div className="space-y-8">
      <HeroSection />
      <GuidedTourController />
      <EntryCards />

      <section className="grid gap-4 lg:grid-cols-3">
        {vendors.map((vendor) => (
          <Card key={vendor.id} className="space-y-3">
            <Badge>{vendor.name}</Badge>
            <h2 className="text-2xl font-semibold text-white">{vendor.summary}</h2>
            <p className="text-sm leading-6 text-slate-300">{vendor.detail}</p>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
              <div className="font-medium text-white">可信度标签</div>
              {vendor.confidence.sourceType} / {vendor.confidence.confidenceLevel}
            </div>
          </Card>
        ))}
      </section>
    </div>
  )
}
