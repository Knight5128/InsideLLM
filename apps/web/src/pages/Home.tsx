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
            <h2 className="text-2xl font-semibold text-slate-900">{vendor.summary}</h2>
            <p className="text-sm leading-6 text-slate-600">{vendor.detail}</p>
            <div className="rounded-2xl border border-cyan-100 bg-cyan-50/55 p-4 text-sm text-slate-600">
              <div className="font-medium text-slate-900">可信度标签</div>
              {vendor.confidence.sourceType} / {vendor.confidence.confidenceLevel}
            </div>
          </Card>
        ))}
      </section>
    </div>
  )
}
