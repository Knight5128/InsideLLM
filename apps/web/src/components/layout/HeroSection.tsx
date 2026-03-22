import { Suspense, lazy } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

const HeroScene = lazy(() =>
  import('@/components/3d/HeroScene').then((module) => ({ default: module.HeroScene })),
)

export function HeroSection() {
  return (
    <section className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr] xl:items-center">
      <div className="space-y-6">
        <div className="space-y-4">
          <h1 className="max-w-2xl text-5xl font-semibold leading-tight text-slate-900 md:text-6xl">
            3D直观展示
            <span className="bg-gradient-to-r from-slate-900 via-sky-700 to-slate-700 bg-clip-text text-transparent">
              {''}
              文本在LLM中传递的全流程
            </span>
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">
            本交互式网站旨在直观展示文本在大语言模型中流转的全流程，聚焦 tokenizer、embedding 以及 LLM 的一种典型架构。
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/token-lab">先做一个 token 实验</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/architecture">进入 3D 展厅</Link>
          </Button>
        </div>
      </div>

      <Suspense fallback={<div className="glass-panel glass-panel-strong h-[26rem] rounded-[2rem]" />}>
        <HeroScene />
      </Suspense>
    </section>
  )
}
