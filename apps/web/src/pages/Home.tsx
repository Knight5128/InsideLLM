import { EntryCards } from '@/components/layout/EntryCards'
import { HeroSection } from '@/components/layout/HeroSection'

export function HomePage() {
  return (
    <div className="space-y-8">
      <HeroSection />
      <EntryCards />
    </div>
  )
}
