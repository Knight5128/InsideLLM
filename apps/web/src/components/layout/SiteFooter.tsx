import { Link } from 'react-router-dom'

import { GlossaryDialog } from '@/components/layout/GlossaryDialog'

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/70">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="font-medium text-slate-200">InsideLLM</div>
          <p>把“文本 → token → 向量 → Transformer”这条链路变成可视化体验。</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link className="hover:text-white" to="/token-lab">
            进入实验室
          </Link>
          <Link className="hover:text-white" to="/timeline">
            浏览时间轴
          </Link>
          <GlossaryDialog />
        </div>
      </div>
    </footer>
  )
}
