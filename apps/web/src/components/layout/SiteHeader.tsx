import { Menu, Orbit, Sparkles } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'

import { EXPERIENCE_MODE_LABELS, PRIMARY_VENDORS } from '@insidellm/shared'

import { Button } from '@/components/ui/button'
import { useAppStore } from '@/stores/useAppStore'

const links = [
  ['/', '首页'],
  ['/architecture', '架构展厅'],
  ['/token-lab', 'Token 实验室'],
  ['/embedding-lab', 'Embedding 训练'],
  ['/timeline', '模型时间轴'],
] as const

export function SiteHeader() {
  const { mode, setMode, vendor, setVendor, motionReduced, toggleReducedMotion } = useAppStore()

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link className="flex items-center gap-3 text-white" to="/">
          <div className="rounded-2xl bg-violet-500/20 p-2 text-violet-200">
            <Orbit className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-200">
              LLM Inside 3D
            </div>
            <div className="text-xs text-slate-400">看见文本如何进入模型内部</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 lg:flex">
          {links.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm transition ${
                  isActive ? 'bg-violet-500 text-white' : 'text-slate-300 hover:bg-white/5'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <div className="hidden rounded-full border border-white/10 bg-white/5 p-1 md:flex">
            {Object.entries(EXPERIENCE_MODE_LABELS).map(([value, label]) => (
              <button
                key={value}
                className={`rounded-full px-3 py-2 text-xs transition ${
                  mode === value ? 'bg-violet-500 text-white' : 'text-slate-300'
                }`}
                onClick={() => setMode(value as typeof mode)}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>

          <select
            className="rounded-full border border-white/10 bg-slate-950 px-3 py-2 text-sm text-slate-200"
            onChange={(event) => setVendor(event.target.value as typeof vendor)}
            value={vendor}
          >
            {PRIMARY_VENDORS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <Button onClick={toggleReducedMotion} variant="secondary">
            <Sparkles className="mr-2 h-4 w-4" />
            {motionReduced ? '开启动效' : '关闭动效'}
          </Button>

          <Button className="lg:hidden" variant="ghost">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
