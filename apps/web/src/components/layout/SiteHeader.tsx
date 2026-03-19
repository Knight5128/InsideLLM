import { Menu, Orbit } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'

import { Button } from '@/components/ui/button'

const links = [
  ['/', '首页'],
  ['/architecture', '架构展厅'],
  ['/token-lab', 'Token 实验室'],
  ['/embedding-lab', 'Embedding 训练'],
  ['/timeline', '模型时间轴'],
] as const

export function SiteHeader() {
  return (
    <header className="glass-panel sticky top-0 z-30 mx-3 mt-3 rounded-[1.75rem] bg-white/62">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link className="flex items-center gap-3 text-slate-900" to="/">
          <div className="glass-chip rounded-2xl p-2 text-slate-700">
            <Orbit className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-700">
              LLM Inside 3D
            </div>
            <div className="text-xs text-slate-500">看见文本如何进入模型内部</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-white/70 bg-white/42 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.82)] lg:flex">
          {links.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm transition ${
                  isActive
                    ? 'border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(241,245,249,0.82))] text-slate-900 shadow-[0_8px_20px_rgba(15,23,42,0.08)]'
                    : 'text-slate-600 hover:bg-white/50'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button className="lg:hidden" variant="ghost">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
