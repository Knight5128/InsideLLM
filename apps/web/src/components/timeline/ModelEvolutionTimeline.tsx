import { useMemo, useState } from 'react'
import { LayoutGroup, motion } from 'framer-motion'

import timelineDatasetJson from '@/content/timeline/tokenizer-evolution.normalized.json'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useAppStore } from '@/stores/useAppStore'

type TimePrecision = 'day' | 'month' | 'year' | 'undisclosed'
type TokenizerFamily =
  | 'bpe'
  | 'byte-level-bpe'
  | 'tiktoken-bpe'
  | 'wordpiece'
  | 'sentencepiece'
  | 'custom-hybrid'
  | 'undisclosed'
  | 'pending-verification'
type VendorFilter = 'all' | TimelineVendorId
type TypeFilter = 'all' | TokenizerFamily

interface DatasetOption {
  id: string
  label: string
}

interface TimelineEntry {
  id: string
  vendorId: TimelineVendorId
  vendorLabel: string
  modelLabel: string
  seriesLabel: string
  time: {
    label: string
    year?: number
    month?: number
    day?: number
    precision: TimePrecision
  }
  sequenceInVendor: number
  tokenizerFamily: TokenizerFamily
  tokenizerFamilyLabel: string
  tokenizerDetail: string
  vocabulary: {
    display: string
    value?: number
  }
  byteLevel: 'yes' | 'no' | 'partial' | 'undisclosed'
  multilingual: 'yes' | 'no' | 'partial' | 'limited' | 'undisclosed'
  preprocessing: string
  disclosure: 'public' | 'partial' | 'undisclosed' | 'pending-verification'
  summary: string
  changeFromPrevious: string
  sourceSection: string
}

type TimelineVendorId =
  | 'openai'
  | 'google'
  | 'anthropic'
  | 'deepseek'
  | 'zhipu'
  | 'qwen'
  | 'xai'
  | 'mistral'
  | 'meta'

interface TimelineDataset {
  meta: {
    sourceOfTruth: string
    vendorOptions: DatasetOption[]
    tokenizerTypeOptions: DatasetOption[]
  }
  entries: TimelineEntry[]
}

const timelineDataset = timelineDatasetJson as TimelineDataset

const disclosureLabel = {
  public: '公开',
  partial: '部分公开',
  undisclosed: '未公开',
  'pending-verification': '待验证',
} as const

const byteLevelLabel = {
  yes: '是',
  no: '否',
  partial: '部分 / 间接支持',
  undisclosed: '未公开',
} as const

const multilingualLabel = {
  yes: '是',
  no: '否',
  partial: '部分',
  limited: '有限',
  undisclosed: '未公开',
} as const

function toTimeValue(entry: TimelineEntry) {
  if (typeof entry.time.year !== 'number') {
    return null
  }

  return Date.UTC(
    entry.time.year,
    (entry.time.month ?? 1) - 1,
    entry.time.day ?? 1,
  )
}

function compareEntries(a: TimelineEntry & { reportIndex: number }, b: TimelineEntry & { reportIndex: number }) {
  const aTime = toTimeValue(a)
  const bTime = toTimeValue(b)

  if (aTime !== null && bTime !== null && aTime !== bTime) {
    return aTime - bTime
  }

  if (aTime !== null && bTime === null) {
    return -1
  }

  if (aTime === null && bTime !== null) {
    return 1
  }

  return a.reportIndex - b.reportIndex
}

export function ModelEvolutionTimeline() {
  const motionReduced = useAppStore((state) => state.motionReduced)
  const [vendorFilter, setVendorFilter] = useState<VendorFilter>('all')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const entries = useMemo(
    () =>
      timelineDataset.entries.map((entry, reportIndex) => ({
        ...entry,
        reportIndex,
      })),
    [],
  )

  const visibleEntries = useMemo(() => {
    const filtered = entries.filter((entry) => {
      const matchesVendor = vendorFilter === 'all' || entry.vendorId === vendorFilter
      const matchesType = typeFilter === 'all' || entry.tokenizerFamily === typeFilter

      return matchesVendor && matchesType
    })

    filtered.sort((a, b) => {
      const value = compareEntries(a, b)
      return sortDirection === 'asc' ? value : -value
    })

    return filtered
  }, [entries, sortDirection, typeFilter, vendorFilter])

  const knownTimeCount = visibleEntries.filter((entry) => toTimeValue(entry) !== null).length
  const undisclosedTimeCount = visibleEntries.length - knownTimeCount

  const vendorOptions = useMemo(
    () => [{ id: 'all', label: '全部厂商' }, ...timelineDataset.meta.vendorOptions],
    [],
  )
  const tokenizerTypeOptions = useMemo(
    () => [{ id: 'all', label: '全部类型' }, ...timelineDataset.meta.tokenizerTypeOptions],
    [],
  )

  const springTransition = motionReduced
    ? { duration: 0.18, ease: 'easeOut' as const }
    : {
        type: 'spring' as const,
        stiffness: 170,
        damping: 22,
        mass: 0.9,
        bounce: 0.32,
      }

  return (
    <section className="space-y-6">
      <Card className="space-y-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl space-y-3">
            <Badge className="w-fit">Tokenizer Timeline</Badge>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
              Tokenizer 时间轴
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
              聚焦各家主流大模型厂商已公开披露的 tokenizer 的演化路径。
            </p>
          </div>

          <div className="xl:max-w-xl xl:flex-1">
            <div className="grid gap-3 md:grid-cols-3">
              <label className="space-y-2">
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                  厂商筛选
                </span>
                <select
                  aria-label="按厂商筛选 tokenizer 时间轴"
                  className="w-full rounded-2xl border border-cyan-100 bg-white/90 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-300"
                  onChange={(event) => setVendorFilter(event.target.value as VendorFilter)}
                  value={vendorFilter}
                >
                  {vendorOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                  类型筛选
                </span>
                <select
                  aria-label="按 tokenizer 类型筛选时间轴"
                  className="w-full rounded-2xl border border-cyan-100 bg-white/90 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-cyan-300"
                  onChange={(event) => setTypeFilter(event.target.value as TypeFilter)}
                  value={typeFilter}
                >
                  {tokenizerTypeOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <div className="space-y-2">
                <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                  时间方向
                </span>
                <Button
                  className="w-full justify-center rounded-2xl py-3"
                  onClick={() =>
                    setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'))
                  }
                  type="button"
                  variant="secondary"
                >
                  {sortDirection === 'asc' ? '正序时间轴' : '逆序时间轴'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
          <span className="rounded-full border border-cyan-100 bg-white/70 px-3 py-1.5">
            全部 {visibleEntries.length}
          </span>
          <span className="rounded-full border border-cyan-100 bg-white/70 px-3 py-1.5">
            时间已知 {knownTimeCount}
          </span>
          <span className="rounded-full border border-cyan-100 bg-white/70 px-3 py-1.5">
            时间未披露 {undisclosedTimeCount}
          </span>
          <span className="rounded-full border border-cyan-100 bg-white/70 px-3 py-1.5">
            未披露确切时间的条目按默认顺序展示
          </span>
        </div>
      </Card>

      {visibleEntries.length === 0 ? (
        <Card className="space-y-3 text-center">
          <h3 className="text-xl font-semibold text-slate-900">没有匹配的节点</h3>
          <p className="text-sm leading-7 text-slate-600">
            当前厂商和 tokenizer 类型组合没有可展示条目，可以切换筛选条件继续查看。
          </p>
        </Card>
      ) : (
        <div className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.74),rgba(240,249,255,0.42))] px-4 py-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] md:px-8 md:py-8">
          <div className="pointer-events-none absolute bottom-0 left-[13px] top-0 w-px bg-[linear-gradient(180deg,rgba(15,23,42,0),rgba(15,23,42,0.9),rgba(15,23,42,0))] md:left-1/2 md:-translate-x-1/2" />

          <LayoutGroup id="tokenizer-timeline">
            <div className="space-y-6 md:space-y-8">
              {visibleEntries.map((entry, index) => {
                const isLeft = index % 2 === 0

                return (
                  <motion.div
                    key={entry.id}
                    layout
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="relative grid grid-cols-[28px_minmax(0,1fr)] gap-4 md:grid-cols-[minmax(0,1fr)_80px_minmax(0,1fr)] md:gap-6"
                    initial={{ opacity: 0, scale: 0.97, y: 18 }}
                    transition={springTransition}
                  >
                    <div className="absolute left-[13px] top-10 h-4 w-4 -translate-x-1/2 md:left-1/2">
                      {!motionReduced ? (
                        <motion.div
                          animate={{
                            opacity: [0.14, 0.5, 0.22, 0.38, 0.12],
                            scale: [0.82, 1.05, 1.92, 1.28, 0.88],
                          }}
                          className="absolute inset-0 rounded-full bg-cyan-300/60 blur-[6px]"
                          transition={{
                            duration: 2.2,
                            ease: [0.22, 1, 0.36, 1],
                            repeat: Number.POSITIVE_INFINITY,
                            times: [0, 0.1, 0.28, 0.48, 1],
                            repeatDelay: 0.08,
                            delay: (index % 2) * 0.72,
                          }}
                        />
                      ) : null}
                      {!motionReduced ? (
                        <motion.div
                          animate={{
                            scale: [1, 0.9, 1.16, 0.98, 1.08, 1],
                          }}
                          className="absolute inset-0 rounded-full"
                          transition={{
                            duration: 2.2,
                            ease: 'easeInOut',
                            repeat: Number.POSITIVE_INFINITY,
                            times: [0, 0.08, 0.16, 0.28, 0.46, 1],
                            repeatDelay: 0.08,
                            delay: (index % 2) * 0.72,
                          }}
                        >
                          <div className="absolute inset-0 rounded-full border-[5px] border-white bg-cyan-400 shadow-[0_0_0_7px_rgba(34,211,238,0.12),0_8px_20px_rgba(14,165,233,0.24)]" />
                        </motion.div>
                      ) : (
                        <div className="absolute inset-0 rounded-full border-[5px] border-white bg-cyan-400 shadow-[0_0_0_7px_rgba(34,211,238,0.12),0_8px_20px_rgba(14,165,233,0.24)]" />
                      )}
                    </div>

                    <div className="hidden md:block md:col-start-1">
                      {isLeft ? (
                        <motion.div layout transition={springTransition}>
                          <TimelineCard
                            align="left"
                            entry={entry}
                            motionReduced={motionReduced}
                          />
                        </motion.div>
                      ) : null}
                    </div>

                    <div className="hidden md:block" />

                    <div className="hidden md:block md:col-start-3">
                      {!isLeft ? (
                        <motion.div layout transition={springTransition}>
                          <TimelineCard
                            align="right"
                            entry={entry}
                            motionReduced={motionReduced}
                          />
                        </motion.div>
                      ) : null}
                    </div>

                    <div className="col-start-2 md:hidden">
                      <motion.div layout transition={springTransition}>
                        <TimelineCard
                          align="mobile"
                          entry={entry}
                          motionReduced={motionReduced}
                        />
                      </motion.div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </LayoutGroup>
        </div>
      )}
    </section>
  )
}

function TimelineCard({
  entry,
  align,
  motionReduced,
}: {
  entry: TimelineEntry
  align: 'left' | 'right' | 'mobile'
  motionReduced: boolean
}) {
  const isLeft = align === 'left'
  const cardClassName =
    align === 'mobile'
      ? 'ml-0'
      : isLeft
        ? 'origin-right'
        : 'origin-left'

  return (
    <motion.div
      className={cardClassName}
      transition={
        motionReduced
          ? { duration: 0.16, ease: 'easeOut' }
          : { type: 'spring', stiffness: 210, damping: 20, mass: 0.78, bounce: 0.28 }
      }
      whileHover={motionReduced ? undefined : { y: -4, scale: 1.01 }}
    >
      <Card className="relative space-y-4 overflow-hidden rounded-[2rem] border border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(248,250,252,0.72))] p-5 shadow-[0_18px_42px_rgba(15,23,42,0.08)]">
        <div
          className={
            align === 'mobile'
              ? 'absolute left-0 top-10 h-px w-5 bg-cyan-200'
              : isLeft
                ? 'absolute -right-6 top-10 h-px w-6 bg-cyan-200'
                : 'absolute -left-6 top-10 h-px w-6 bg-cyan-200'
          }
        />

        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-white/80 text-slate-600">{entry.vendorLabel}</Badge>
          <Badge className="bg-cyan-50/90 text-cyan-800">{entry.time.label}</Badge>
          <Badge className="bg-slate-100/90 text-slate-700">{entry.tokenizerFamilyLabel}</Badge>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
            {entry.seriesLabel}
          </p>
          <h3 className="text-xl font-semibold leading-7 text-slate-900">{entry.modelLabel}</h3>
          <p className="text-sm leading-7 text-slate-600">{entry.summary}</p>
          <p className="text-xs leading-6 text-slate-400">来源区段：{entry.sourceSection}</p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-slate-600">
          <span className="rounded-full border border-cyan-100 bg-cyan-50/70 px-3 py-1.5">
            词表 {entry.vocabulary.display}
          </span>
          <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1.5">
            Byte-level {byteLevelLabel[entry.byteLevel]}
          </span>
          <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1.5">
            多语 {multilingualLabel[entry.multilingual]}
          </span>
          <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1.5">
            公开度 {disclosureLabel[entry.disclosure]}
          </span>
        </div>

        <div className="rounded-2xl border border-cyan-100 bg-cyan-50/60 p-4 text-sm leading-7 text-slate-600">
          <span className="font-medium text-slate-900">Tokenizer 说明：</span> {entry.tokenizerDetail}
        </div>

        <div className="rounded-2xl border border-white/80 bg-white/70 p-4 text-sm leading-7 text-slate-600">
          <span className="font-medium text-slate-900">预处理 / 规则：</span> {entry.preprocessing}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-sm leading-7 text-slate-600">
          <span className="font-medium text-slate-900">相较前一阶段：</span> {entry.changeFromPrevious}
        </div>
      </Card>
    </motion.div>
  )
}
