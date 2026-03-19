import { Outlet } from 'react-router-dom'

import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'

export function SiteLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,_#fbfcfe_0%,_#f5f8fb_54%,_#eef2f6_100%)] text-slate-700">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.92),_transparent_58%)]" />
      <div className="pointer-events-none absolute left-[-8rem] top-20 h-64 w-64 rounded-full bg-sky-50/60 blur-3xl" />
      <div className="pointer-events-none absolute bottom-16 right-[-6rem] h-72 w-72 rounded-full bg-slate-100/65 blur-3xl" />
      <SiteHeader />
      <main className="relative mx-auto flex max-w-7xl flex-col gap-12 px-6 py-8">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
