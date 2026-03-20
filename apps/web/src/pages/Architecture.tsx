import { Suspense, lazy, useMemo, useState } from 'react'
import { Sparkles } from 'lucide-react'

import {
  GPT_EXHIBITION_MODELS,
  GPT_EXHIBITION_SECTIONS,
  type ExhibitionModelId,
  type ExhibitionSectionId,
} from '@/components/3d/gptExhibitionData'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { usePerformanceMode } from '@/hooks/usePerformanceMode'
import { useAppStore } from '@/stores/useAppStore'

const GptArchitectureExhibitionScene = lazy(() =>
  import('@/components/3d/GptArchitectureExhibitionScene').then((module) => ({
    default: module.GptArchitectureExhibitionScene,
  })),
)

export function ArchitecturePage() {
  const detailMode = useAppStore((state) => state.detailMode)
  const setDetailMode = useAppStore((state) => state.setDetailMode)
  const motionReduced = useAppStore((state) => state.motionReduced)
  const toggleReducedMotion = useAppStore((state) => state.toggleReducedMotion)
  const { prefersLiteScene } = usePerformanceMode()
  const [selectedModelId, setSelectedModelId] = useState<ExhibitionModelId>('gpt2-small')
  const [selectedSectionId, setSelectedSectionId] = useState<ExhibitionSectionId>('overview')

  const selectedModel = useMemo(
    () => GPT_EXHIBITION_MODELS.find((model) => model.id === selectedModelId) ?? GPT_EXHIBITION_MODELS[0],
    [selectedModelId],
  )

  const selectedSection = useMemo(
    () =>
      GPT_EXHIBITION_SECTIONS.find((section) => section.id === selectedSectionId) ??
      GPT_EXHIBITION_SECTIONS[0],
    [selectedSectionId],
  )

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-[0.26em] text-slate-500">Architecture Hall</div>
            <h1 className="text-4xl font-semibold text-slate-900">GPT 系列模型 3D 架构展厅</h1>
            <p className="max-w-3xl text-sm text-slate-600">
              参考原始 `inside-llm` 展示逻辑重构为多模型并排展厅。左侧章节驱动右侧相机自动聚焦，
              可在 GPT-2 (small)、nano-gpt、GPT-2 (XL) 与 GPT-3 之间切换观察。
            </p>
          </div>
          <Button onClick={toggleReducedMotion} type="button" variant="secondary">
            <Sparkles className="mr-2 h-4 w-4" />
            {motionReduced ? '开启动效' : '关闭动效'}
          </Button>
        </div>
        <div className="flex gap-2">
          <button
            className={`rounded-full px-4 py-2 text-sm ${
              detailMode === 'basic' ? 'bg-cyan-300 text-slate-900' : 'bg-white/80 text-slate-600'
            }`}
            onClick={() => setDetailMode('basic')}
            type="button"
          >
            初级视图
          </button>
          <button
            className={`rounded-full px-4 py-2 text-sm ${
              detailMode === 'advanced' ? 'bg-cyan-300 text-slate-900' : 'bg-white/80 text-slate-600'
            }`}
            onClick={() => setDetailMode('advanced')}
            type="button"
          >
            高级视图
          </button>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[22rem_minmax(0,1fr)]">
        <Card className="space-y-5">
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-[0.22em] text-slate-500">当前章节</div>
            <div className="text-2xl font-semibold text-slate-900">{selectedSection.title}</div>
            <p className="text-sm leading-6 text-slate-600">{selectedSection.summary}</p>
          </div>

          <div className="rounded-3xl border border-white/70 bg-white/65 p-4">
            <div className="text-xs uppercase tracking-[0.22em] text-slate-500">当前模型</div>
            <div className="mt-2 text-xl font-semibold text-slate-900">{selectedModel.name}</div>
            <p className="mt-1 text-sm text-slate-600">{selectedModel.subtitle}</p>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs text-slate-600">
              <div className="rounded-2xl border border-white/70 bg-white/80 px-3 py-2">
                <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Layers</div>
                <div className="mt-1 font-semibold text-slate-900">{selectedModel.layers}</div>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/80 px-3 py-2">
                <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Hidden</div>
                <div className="mt-1 font-semibold text-slate-900">{selectedModel.hiddenSize}</div>
              </div>
              <div className="rounded-2xl border border-white/70 bg-white/80 px-3 py-2">
                <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Params</div>
                <div className="mt-1 font-semibold text-slate-900">{selectedModel.paramsLabel}</div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs uppercase tracking-[0.22em] text-slate-500">章节导航</div>
            {GPT_EXHIBITION_SECTIONS.map((section, index) => {
              const active = section.id === selectedSectionId

              return (
                <button
                  className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                    active
                      ? 'border-white/90 bg-white/90 shadow-[0_14px_34px_rgba(15,23,42,0.08)]'
                      : 'border-white/60 bg-white/55 hover:bg-white/75'
                  }`}
                  key={section.id}
                  onClick={() => setSelectedSectionId(section.id)}
                  type="button"
                >
                  <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    Chapter {index + 1}
                  </div>
                  <div className="mt-1 font-medium text-slate-900">{section.title}</div>
                </button>
              )
            })}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              {GPT_EXHIBITION_MODELS.map((model) => {
                const active = model.id === selectedModelId

                return (
                  <button
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      active
                        ? 'border-white/90 bg-white/92 text-slate-900 shadow-[0_12px_28px_rgba(15,23,42,0.08)]'
                        : 'border-white/65 bg-white/60 text-slate-600 hover:bg-white/78'
                    }`}
                    key={model.id}
                    onClick={() => setSelectedModelId(model.id)}
                    type="button"
                  >
                    {model.name}
                  </button>
                )
              })}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span className="rounded-full border border-white/70 bg-white/70 px-3 py-1">
                章节切换会自动缩放并聚焦对应模块
              </span>
              <span className="rounded-full border border-white/70 bg-white/70 px-3 py-1">
                点击 3D 模块可反向切换章节
              </span>
            </div>
          </Card>

          {prefersLiteScene ? (
            <Card className="space-y-3">
              <div className="text-sm text-slate-600">
                当前设备处于轻量模式，以下用结构化卡片替代 3D 画布。
              </div>
              {[
                `${selectedModel.name} · Tokens`,
                `${selectedModel.name} · Token / Position Embedding`,
                `${selectedModel.name} · ${
                  detailMode === 'basic' ? 'Transformer Blocks' : 'LayerNorm / Attention / Projection / MLP'
                }`,
                `${selectedModel.name} · Final Norm / LM Head / Softmax`,
              ].map((label) => (
                <div
                  className="rounded-2xl border border-cyan-100 bg-cyan-50/55 px-4 py-3 text-sm text-slate-700"
                  key={label}
                >
                  {label}
                </div>
              ))}
            </Card>
          ) : (
            <Suspense
              fallback={<div className="h-[42rem] rounded-[2rem] border border-cyan-100 bg-white/80" />}
            >
              <GptArchitectureExhibitionScene
                detailMode={detailMode}
                onSelect={(modelId, sectionId) => {
                  setSelectedModelId(modelId)
                  setSelectedSectionId(sectionId)
                }}
                selectedModelId={selectedModelId}
                selectedSectionId={selectedSectionId}
              />
            </Suspense>
          )}
        </div>
      </div>
    </div>
  )
}
