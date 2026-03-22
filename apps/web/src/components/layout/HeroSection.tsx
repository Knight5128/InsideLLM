import { Suspense, lazy } from 'react'
import { Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { usePerformanceMode } from '@/hooks/usePerformanceMode'
import { useAppStore } from '@/stores/useAppStore'

const HeroScene = lazy(() =>
  import('@/components/3d/HeroScene').then((module) => ({ default: module.HeroScene })),
)

export function HeroSection() {
  const { prefersLiteScene } = usePerformanceMode()
  const motionReduced = useAppStore((state) => state.motionReduced)
  const toggleReducedMotion = useAppStore((state) => state.toggleReducedMotion)

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
            本示例网站旨在直观展示文本在大语言模型中流转的全流程，聚焦 tokenizer、embedding 以及 LLM 的一种典型架构。
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/token-lab">先做一个 token 实验</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/architecture">进入 3D 展厅</Link>
          </Button>
          <Button onClick={toggleReducedMotion} type="button" variant="secondary">
            <Sparkles className="mr-2 h-4 w-4" />
            {motionReduced ? '开启动效' : '关闭动效'}
          </Button>
        </div>
      </div>

      {prefersLiteScene ? (
        <div className="glass-panel glass-panel-strong h-[26rem] rounded-[2rem] p-6">
          <div className="flex h-full flex-col gap-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                  Prompt to Response
                </p>
                <h2 className="mt-2 text-xl font-semibold text-slate-900">LLM 流程不是一条线</h2>
                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  这里把“切词、向量化、上下文计算、采样输出”拆成不同形态，用户可以更自然地理解每一步的角色。
                </p>
              </div>
              <div className="glass-chip rounded-full px-3 py-1 text-xs font-medium text-slate-500">
                5 stages
              </div>
            </div>

            <div className="grid flex-1 gap-4 md:grid-cols-[1.05fr_0.95fr]">
              <div className="flex flex-col gap-4">
                <div className="glass-chip rounded-[1.75rem] p-4">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>输入文本</span>
                    <span>Prompt</span>
                  </div>
                  <div className="mt-3 space-y-2 text-sm text-slate-700">
                    <div className="h-2.5 w-5/6 rounded-full bg-slate-300/70" />
                    <div className="h-2.5 w-full rounded-full bg-slate-300/60" />
                    <div className="h-2.5 w-3/4 rounded-full bg-sky-200/80" />
                  </div>
                </div>

                <div className="glass-chip rounded-[1.75rem] p-4">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>切成 token</span>
                    <span>Tokenizer</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {['tok 1', 'tok 2', 'tok 3', 'tok 4'].map((token, index) => (
                      <span
                        key={token}
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          index === 1
                            ? 'bg-sky-100 text-sky-700'
                            : 'bg-white/90 text-slate-600'
                        }`}
                      >
                        {token}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="glass-chip rounded-[1.75rem] p-4">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>映射到向量空间</span>
                    <span>Embedding</span>
                  </div>
                  <div className="mt-4 flex items-end gap-2">
                    {[32, 64, 88, 52, 76, 40].map((height, index) => (
                      <div
                        key={height}
                        className={`w-5 rounded-t-2xl ${
                          index === 2 ? 'bg-sky-300' : 'bg-slate-300/80'
                        }`}
                        style={{ height: `${height}px` }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="glass-chip rounded-[1.75rem] p-4">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>上下文计算</span>
                    <span>Transformer</span>
                  </div>
                  <div className="mt-4 space-y-3">
                    {['注意力聚合', '前馈变换', '残差更新'].map((item, index) => (
                      <div
                        key={item}
                        className={`rounded-2xl border px-4 py-3 text-sm ${
                          index === 1
                            ? 'border-sky-200 bg-sky-50/80 text-sky-700'
                            : 'border-white/15 bg-white/80 text-slate-600'
                        }`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-chip flex-1 rounded-[1.75rem] p-4">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>候选输出</span>
                    <span>Sampling</span>
                  </div>
                  <div className="mt-4 space-y-3">
                    {[
                      { label: '候选 A', active: false },
                      { label: '候选 B', active: false },
                      { label: '最终输出', active: true },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
                          item.active
                            ? 'border-sky-200 bg-sky-100/90 text-sky-700'
                            : 'border-white/15 bg-white/75 text-slate-500'
                        }`}
                      >
                        {item.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
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
