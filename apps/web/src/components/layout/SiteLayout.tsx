import { Outlet } from 'react-router-dom'

import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'

export function SiteLayout() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(124,58,237,0.28),_transparent_28%),linear-gradient(180deg,_#020617_0%,_#0f172a_50%,_#111827_100%)] text-slate-100">
      <SiteHeader />
      <main className="mx-auto flex max-w-7xl flex-col gap-12 px-6 py-8">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
