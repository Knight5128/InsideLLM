import { Suspense, lazy } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { usePerformanceMode } from '@/hooks/usePerformanceMode'

const HeroScene = lazy(() =>
  import('@/components/3d/HeroScene').then((module) => ({ default: module.HeroScene })),
)

export function HeroSection() {
  const { prefersLiteScene } = usePerformanceMode()

  return (
    <section className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr] xl:items-center">
      <div className="space-y-6">
        <Badge>面向非技术用户的可交互科普网站</Badge>
        <div className="space-y-4">
          <h1 className="max-w-2xl text-5xl font-semibold leading-tight text-slate-900 md:text-6xl">
            用 3D 方式看见
            <span className="bg-gradient-to-r from-slate-900 via-sky-700 to-slate-700 bg-clip-text text-transparent">
              {' '}
              文本如何进入大模型内部
            </span>
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-600">
            InsideLLM 把 “文本 {'->'} token {'->'} 向量 {'->'} Transformer {'->'} 输出” 这条链路拆成可互动的空间场景、
            时间轴和实验台，让不了解大模型的人也能快速建立直觉。
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.24em] text-slate-500">
          <span className="glass-chip rounded-full px-4 py-2">Liquid Glass</span>
          <span className="glass-chip rounded-full px-4 py-2">Quiet Blue</span>
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

      {prefersLiteScene ? (
        <div className="glass-panel glass-panel-strong flex h-[26rem] flex-col justify-between rounded-[2rem] p-6">
          <Badge>2D 降级模式</Badge>
          <div className="space-y-4">
            <div className="glass-chip rounded-3xl p-4 text-slate-700">
              文本
            </div>
            <div className="glass-chip rounded-3xl p-4 text-slate-700">
              token
            </div>
            <div className="glass-chip rounded-3xl p-4 text-slate-700">
              向量
            </div>
            <div className="glass-chip rounded-3xl p-4 text-slate-700">
              Transformer
            </div>
            <div className="glass-chip rounded-3xl p-4 text-slate-700">
              输出
            </div>
          </div>
        </div>
      ) : (
        <Suspense
          fallback={<div className="glass-panel glass-panel-strong h-[26rem] rounded-[2rem]" />}
        >
          <HeroScene />
        </Suspense>
      )}
    </section>
  )
}
